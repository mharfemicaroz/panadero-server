const salaryRepository = global.requireV2("repositories/hr/salaryRepository");
const moment = require("moment");

class SalaryService {
  async getList(queryParams) {
    return salaryRepository.listing(queryParams);
  }

  async create(data) {
    // Calculate rates based on basic salary
    const workingDaysPerMonth = 22; // Standard working days
    const workingHoursPerDay = 8; // Standard working hours

    const dailyRate = parseFloat(
      (data.basic_salary / workingDaysPerMonth).toFixed(2)
    );
    const hourlyRate = parseFloat((dailyRate / workingHoursPerDay).toFixed(2));

    // Set effective date to start of next month if not provided
    const effectiveDate =
      data.effective_date ||
      moment().add(1, "months").startOf("month").format("YYYY-MM-DD");

    const salaryData = {
      ...data,
      daily_rate: dailyRate,
      hourly_rate: hourlyRate,
      effective_date: effectiveDate,
    };

    return salaryRepository.create(salaryData);
  }

  async getById(id) {
    return salaryRepository.getById(id);
  }

  async update(id, data) {
    // If basic salary is being updated, recalculate rates
    if (data.basic_salary) {
      const workingDaysPerMonth = 22;
      const workingHoursPerDay = 8;

      const dailyRate = parseFloat(
        (data.basic_salary / workingDaysPerMonth).toFixed(2)
      );
      const hourlyRate = parseFloat(
        (dailyRate / workingHoursPerDay).toFixed(2)
      );

      data = {
        ...data,
        daily_rate: dailyRate,
        hourly_rate: hourlyRate,
      };
    }

    return salaryRepository.update(id, data);
  }

  async delete(id) {
    return salaryRepository.delete(id);
  }

  async getCurrentSalary(employeeId) {
    return salaryRepository.getCurrentSalary(employeeId);
  }

  async getSalaryHistory(employeeId) {
    return salaryRepository.getSalaryHistory(employeeId);
  }

  async calculateSalaryRates(basicSalary) {
    const workingDaysPerMonth = 22;
    const workingHoursPerDay = 8;

    const dailyRate = parseFloat(
      (basicSalary / workingDaysPerMonth).toFixed(2)
    );
    const hourlyRate = parseFloat((dailyRate / workingHoursPerDay).toFixed(2));
    const overtimeRate = parseFloat((hourlyRate * 1.25).toFixed(2));
    const holidayRate = parseFloat((dailyRate * 2).toFixed(2));
    const nightDifferentialRate = parseFloat((hourlyRate * 1.1).toFixed(2));

    return {
      basic_salary: basicSalary,
      daily_rate: dailyRate,
      hourly_rate: hourlyRate,
      overtime_rate: overtimeRate,
      holiday_rate: holidayRate,
      night_differential_rate: nightDifferentialRate,
    };
  }

  async validateSalaryChange(employeeId, newSalary) {
    const currentSalary = await this.getCurrentSalary(employeeId);

    if (!currentSalary) {
      return { valid: true, message: "Initial salary setup" };
    }

    // Check if new salary is less than current
    if (newSalary < currentSalary.basic_salary) {
      return {
        valid: false,
        message: "New salary cannot be less than current salary",
      };
    }

    // Check if increase is more than 100%
    const percentageIncrease =
      ((newSalary - currentSalary.basic_salary) / currentSalary.basic_salary) *
      100;
    if (percentageIncrease > 100) {
      return {
        valid: false,
        message: "Salary increase cannot exceed 100% of current salary",
      };
    }

    return { valid: true, message: "Valid salary change" };
  }
}

module.exports = new SalaryService();
