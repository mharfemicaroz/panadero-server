// services/product/saleService.js

const saleRepository = global.requireV2("repositories/product/saleRepository");
const inventoryService = require("./inventoryService");
const db = global.requireV2("models");

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

    // *** Pre-check inventory levels if the sale is being created as "completed" ***
    if (saleData.status === "completed") {
      for (const si of itemsData) {
        // Use a negative quantity change (stock OUT)
        await inventoryService.checkAvailabilityForItemInWarehouse(
          si.item_id,
          saleData.warehouse_id,
          -si.quantity
        );
      }
    }

    // Create the sale record with its sale items.
    const newSale = await saleRepository.createWithItems(saleData, itemsData);
    const finalSale = await saleRepository.getById(newSale.id);

    // If the sale is completed, adjust the inventory.
    if (newSale.status === "completed") {
      await this.processCompletedSale(finalSale);
    }
    return newSale;
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

    // *** Pre-check inventory levels before completing the sale ***
    for (const si of sale.saleItems) {
      await inventoryService.checkAvailabilityForItemInWarehouse(
        si.item_id,
        sale.warehouse_id,
        -si.quantity
      );
    }

    // Update sale status to "completed" and process inventory adjustments.
    const updatedSale = await saleRepository.update(id, {
      status: "completed",
    });
    const finalSale = await saleRepository.getById(id);
    await this.processCompletedSale(finalSale);
    return updatedSale;
  }

  /**
   * Adjusts inventory for each sale item.
   * Uses a transaction so that if any adjustment fails, the entire operation is rolled back.
   */
  async processCompletedSale(saleRecord) {
    const t = await db.sequelize.transaction();
    try {
      for (const si of saleRecord.saleItems) {
        // Adjust inventory (the inventory service’s adjustQuantity method will run its own check again)
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
