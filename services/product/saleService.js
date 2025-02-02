const saleRepository = require("../../repositories/product/saleRepository");
const inventoryService = require("./inventoryService");
const db = require("../../models");

class SaleService {
  async getList(queryParams) {
    return await saleRepository.listing(queryParams);
  }

  async create(data) {
    const {
      user_id,
      branch_id,
      warehouse_id,
      customer_id,
      customer_name,
      status,
      sale_date,
      total_amount,
      discount_total,
      remarks,
      payment_type,
      checkNumber,
      bankName,
      walletReference,
      cardAuthCode,
      bankReference,
      items,
    } = data;

    const saleData = {
      user_id,
      branch_id,
      warehouse_id,
      customer_id: customer_id || null,
      customer_name: customer_name || null,
      status: status || "suspended",
      sale_date: sale_date || new Date(),
      total_amount: total_amount || 0,
      discount_total: discount_total || 0,
      remarks: remarks || null,
      payment_type,
      checkNumber,
      bankName,
      walletReference,
      cardAuthCode,
      bankReference,
    };

    const itemsData = items || [];
    return await saleRepository.createWithItems(saleData, itemsData);
  }

  async getById(id) {
    return await saleRepository.getById(id);
  }

  async update(id, data) {
    return await saleRepository.update(id, data);
  }

  async delete(id) {
    return await saleRepository.delete(id);
  }

  async completeSale(id) {
    const sale = await saleRepository.getById(id);
    if (!sale) return null;
    if (sale.status === "completed") return sale;
    const updatedSale = await saleRepository.update(id, {
      status: "completed",
    });
    const finalSale = await saleRepository.getById(id);
    await this.processCompletedSale(finalSale);
    return updatedSale;
  }

  async processCompletedSale(saleRecord) {
    const t = await db.sequelize.transaction();
    try {
      for (const si of saleRecord.saleItems) {
        await inventoryService.adjustItemInWarehouse(
          si.item_id,
          saleRecord.warehouse_id,
          -si.quantity
        );
      }
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
}

module.exports = new SaleService();
