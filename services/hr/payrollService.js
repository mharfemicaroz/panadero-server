const payrollRepository = global.requireV2("repositories/hr/payrollRepository");
const salaryService = global.requireV2("services/hr/salaryService");
const attendanceRepository = global.requireV2(
  "repositories/hr/attendanceRepository"
);
const deductionRepository = global.requireV2(
  "repositories/hr/deductionRepository"
);
const allowanceRepository = global.requireV2(
  "repositories/hr/allowanceRepository"
);
const db = global.requireV2("models");
const moment = require("moment");

class PayrollService {
  async getList(queryParams) {
    return payrollRepository.listing(queryParams);
  }

  async getById(id) {
    return payrollRepository.getById(id);
  }

  async create(payrollData) {
    // Start a transaction
    const result = await db.sequelize.transaction(async (t) => {
      // Create the payroll record
      const payroll = await db.Payroll.create(
        {
          employee_id: payrollData.employee_id,
          payroll_date: payrollData.payroll_date,
          start_date: payrollData.start_date,
          end_date: payrollData.end_date,
          basic_salary: payrollData.basic_salary,
          total_days_worked: payrollData.total_days_worked,
          total_hours_worked: payrollData.total_hours_worked,
          overtime_hours: payrollData.overtime_hours,
          gross_salary: payrollData.gross_salary,
          overtime_pay: payrollData.overtime_pay,
          allowances: payrollData.allowances,
          deductions: payrollData.deductions,
          tax_deduction: payrollData.tax_deduction,
          net_salary: payrollData.net_salary,
          status: payrollData.status || "draft",
        },
        { transaction: t }
      );

      // Create payroll deductions
      if (
        payrollData.deduction_details &&
        payrollData.deduction_details.length > 0
      ) {
        const payrollDeductions = payrollData.deduction_details.map(
          (detail) => ({
            payroll_id: payroll.id,
            deduction_id: detail.deduction_id,
            amount: Number(detail.amount),
            remarks: detail.remarks,
          })
        );
        await db.PayrollDeduction.bulkCreate(payrollDeductions, {
          transaction: t,
        });
      }

      // Create payroll allowances
      if (
        payrollData.allowance_details &&
        payrollData.allowance_details.length > 0
      ) {
        const payrollAllowances = payrollData.allowance_details.map(
          (detail) => ({
            payroll_id: payroll.id,
            allowance_id: detail.allowance_id,
            amount: Number(detail.amount),
            is_taxable: detail.is_taxable,
            remarks: detail.remarks,
          })
        );
        await db.PayrollAllowance.bulkCreate(payrollAllowances, {
          transaction: t,
        });
      }

      return payroll;
    });

    // Return the complete payroll record with its relations
    return this.getById(result.id);
  }

  async update(id, data) {
    return db.sequelize.transaction(async (t) => {
      let payroll = await db.Payroll.findByPk(id);
      if (!payroll) return null;

      // Update the payroll record
      await payroll.update(data, { transaction: t });

      // Update payroll deductions if provided
      if (data.deduction_details) {
        await db.PayrollDeduction.destroy({
          where: { payroll_id: id },
          transaction: t,
        });

        if (data.deduction_details.length > 0) {
          await db.PayrollDeduction.bulkCreate(
            data.deduction_details.map((detail) => ({
              payroll_id: id,
              ...detail,
            })),
            { transaction: t }
          );
        }
      }

      // Update payroll allowances if provided
      if (data.allowance_details) {
        await db.PayrollAllowance.destroy({
          where: { payroll_id: id },
          transaction: t,
        });

        if (data.allowance_details.length > 0) {
          await db.PayrollAllowance.bulkCreate(
            data.allowance_details.map((detail) => ({
              payroll_id: id,
              ...detail,
            })),
            { transaction: t }
          );
        }
      }

      // Re-fetch the payroll including the associated employee data
      payroll = await db.Payroll.findByPk(id, {
        include: [
          {
            model: db.Employee,
            as: "employee",
          },
        ],
        transaction: t,
      });

      return payroll;
    });
  }

  async delete(id) {
    return db.sequelize.transaction(async (t) => {
      await db.PayrollDeduction.destroy({
        where: { payroll_id: id },
        transaction: t,
      });
      await db.PayrollAllowance.destroy({
        where: { payroll_id: id },
        transaction: t,
      });
      return db.Payroll.destroy({
        where: { id },
        transaction: t,
      });
    });
  }

  async calculatePayroll(employeeId, startDate, endDate) {
    // Get employee's current salary
    const salary = await salaryService.getCurrentSalary(employeeId);
    if (!salary) {
      throw new Error("No active salary found for employee");
    }

    // Get attendance records for the period
    const attendanceRecords =
      await attendanceRepository.findByEmployeeAndDateRange(
        employeeId,
        startDate,
        endDate
      );

    // Calculate totals from attendance records including night differential and holiday metrics
    const {
      totalDays,
      totalHours,
      overtimeHours,
      nightDifferentialHours,
      holidayDays,
    } = this._calculateFromAttendance(attendanceRecords);

    // Separate regular and holiday days
    const regularDays = totalDays - holidayDays;

    // Calculate basic pay:
    // - Regular days are paid at the standard daily rate.
    // - Holiday days use a holiday multiplier.
    const holidayMultiplier = salary.holiday_rate || 2.0; // default to 2x if not provided
    const basicPayRegular = regularDays * Number(salary.daily_rate);
    const basicPayHoliday =
      holidayDays * Number(salary.daily_rate) * holidayMultiplier;
    const basicPay = basicPayRegular + basicPayHoliday;

    // Calculate overtime pay
    const overtimePay = Number(overtimeHours) * Number(salary.overtime_rate);

    // Calculate night differential pay
    const nightDifferentialRate =
      salary.night_differential_rate || Number(salary.daily_rate) * 0.1;
    const nightDifferentialPay =
      Number(nightDifferentialHours) * Number(nightDifferentialRate);

    // Get and calculate deductions and allowances based on the basic pay
    const { deductionsTotal, deductionItems } = await this._calculateDeductions(
      employeeId,
      basicPay
    );
    const { allowancesTotal, allowanceItems } = await this._calculateAllowances(
      employeeId,
      basicPay
    );

    // Calculate gross salary including night differential and allowances
    const grossSalary =
      basicPay + overtimePay + nightDifferentialPay + Number(allowancesTotal);

    // Calculate tax deduction
    const taxDeduction = this._calculateTax(
      grossSalary,
      Number(salary.tax_rate)
    );

    // Calculate net salary after deductions and tax
    const netSalary = grossSalary - deductionsTotal - taxDeduction;

    return {
      employee_id: employeeId,
      payroll_date: moment().format("YYYY-MM-DD"),
      start_date: startDate,
      end_date: endDate,
      basic_salary: Number(salary.basic_salary),
      total_days_worked: Number(totalDays),
      total_hours_worked: Number(totalHours),
      overtime_hours: Number(overtimeHours),
      night_differential_hours: Number(nightDifferentialHours),
      gross_salary: Number(grossSalary.toFixed(2)),
      overtime_pay: Number(overtimePay.toFixed(2)),
      night_differential_pay: Number(nightDifferentialPay.toFixed(2)),
      basic_pay: Number(basicPay.toFixed(2)),
      allowances: Number(allowancesTotal.toFixed(2)),
      deductions: Number(deductionsTotal.toFixed(2)),
      tax_deduction: Number(taxDeduction.toFixed(2)),
      net_salary: Number(netSalary.toFixed(2)),
      status: "draft",
      deduction_details: deductionItems,
      allowance_details: allowanceItems,
    };
  }

  _calculateFromAttendance(attendanceRecords) {
    // Initialize totals including extra metrics for night differential and holiday days.
    const totals = attendanceRecords.reduce(
      (acc, record) => {
        // Determine full or half-day work value.
        const dayValue =
          record.status === "present"
            ? 1
            : record.status === "half_day"
            ? 0.5
            : 0;
        acc.totalDays += dayValue;
        acc.totalHours += Number(record.total_hours || 0);
        acc.overtimeHours += Number(record.overtime_hours || 0);
        acc.nightDifferentialHours += Number(
          record.night_differential_hours || 0
        );
        if (record.is_holiday) {
          acc.holidayDays += dayValue;
        }
        return acc;
      },
      {
        totalDays: 0,
        totalHours: 0,
        overtimeHours: 0,
        nightDifferentialHours: 0,
        holidayDays: 0,
      }
    );

    return {
      totalDays: Number(totals.totalDays),
      totalHours: Number(totals.totalHours),
      overtimeHours: Number(totals.overtimeHours),
      nightDifferentialHours: Number(totals.nightDifferentialHours),
      holidayDays: Number(totals.holidayDays),
    };
  }

  async _calculateDeductions(employeeId, basicPay) {
    const deductions = await deductionRepository.getActiveDeductions();
    let deductionsTotal = 0;
    const deductionItems = [];

    for (const deduction of deductions) {
      const amount =
        deduction.amount_type === "fixed"
          ? Number(deduction.amount)
          : (Number(basicPay) * Number(deduction.amount)) / 100;

      deductionsTotal += amount;
      deductionItems.push({
        deduction_id: deduction.id,
        amount: Number(amount.toFixed(2)),
        remarks: `${deduction.name} for payroll period`,
      });
    }

    return {
      deductionsTotal: Number(deductionsTotal.toFixed(2)),
      deductionItems,
    };
  }

  async _calculateAllowances(employeeId, basicPay) {
    const allowances = await allowanceRepository.getActiveAllowances();
    let allowancesTotal = 0;
    const allowanceItems = [];

    for (const allowance of allowances) {
      const amount =
        allowance.amount_type === "fixed"
          ? Number(allowance.amount)
          : (Number(basicPay) * Number(allowance.amount)) / 100;

      allowancesTotal += amount;
      allowanceItems.push({
        allowance_id: allowance.id,
        amount: Number(amount.toFixed(2)),
        is_taxable: allowance.is_taxable,
        remarks: `${allowance.name} for payroll period`,
      });
    }

    return {
      allowancesTotal: Number(allowancesTotal.toFixed(2)),
      allowanceItems,
    };
  }

  _calculateTax(grossSalary, taxRate) {
    return Number(((Number(grossSalary) * Number(taxRate)) / 100).toFixed(2));
  }

  async generatePayroll(employeeId, startDate, endDate) {
    const payrollData = await this.calculatePayroll(
      employeeId,
      startDate,
      endDate
    );
    return this.create(payrollData);
  }

  async approvePayroll(id) {
    return this.update(id, { status: "approved" });
  }

  async markAsPaid(id, paymentDetails) {
    return this.update(id, {
      status: "paid",
      payment_method: paymentDetails.method,
      remarks: paymentDetails.remarks,
    });
  }
}

module.exports = new PayrollService();
