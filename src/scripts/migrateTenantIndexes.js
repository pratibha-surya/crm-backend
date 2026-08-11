import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.model.js";
import Quotation from "../models/Quotation.model.js";
import Invoice from "../models/Invoice.model.js";
import Ticket from "../models/Ticket.model.js";

const dropIfPresent = async (collection, indexName) => {
  try {
    await collection.dropIndex(indexName);
    console.log(`Removed legacy index: ${indexName}`);
  } catch (error) {
    if (error.codeName !== "IndexNotFound") throw error;
  }
};

const run = async () => {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI must be configured");
  await mongoose.connect(process.env.MONGODB_URI);

  const migrations = [
    [Product.collection, "sku_1", { companyId: 1, sku: 1 }, "companyId_1_sku_1"],
    [Quotation.collection, "quotationNumber_1", { companyId: 1, quotationNumber: 1 }, "companyId_1_quotationNumber_1"],
    [Invoice.collection, "invoiceNumber_1", { companyId: 1, invoiceNumber: 1 }, "companyId_1_invoiceNumber_1"],
    [Ticket.collection, "ticketNumber_1", { companyId: 1, ticketNumber: 1 }, "companyId_1_ticketNumber_1"]
  ];

  for (const [collection, legacyIndex, keys, name] of migrations) {
    await dropIfPresent(collection, legacyIndex);
    await collection.createIndex(keys, { unique: true, name });
  }

  console.log("Tenant-scoped index migration complete.");
};

run()
  .catch((error) => { console.error("Index migration failed:", error.message); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
