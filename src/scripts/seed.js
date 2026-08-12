import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Company from "../models/Company.model.js";
import Settings from "../models/Settings.model.js";
import Role from "../models/Role.model.js";
import Branch from "../models/Branch.model.js";
import Department from "../models/Department.model.js";
import Designation from "../models/Designation.model.js";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Lead from "../models/Lead.model.js";
import Followup from "../models/Followup.model.js";
import Meeting from "../models/Meeting.model.js";
import Task from "../models/Task.model.js";
import Deal from "../models/Deal.model.js";
import Customer from "../models/Customer.model.js";
import Quotation from "../models/Quotation.model.js";
import Invoice from "../models/Invoice.model.js";
import Payment from "../models/Payment.model.js";
import Ticket from "../models/Ticket.model.js";
import Notification from "../models/Notification.model.js";
import AuditLog from "../models/AuditLog.model.js";
import Inquiry from "../models/Inquiry.model.js";

const upsert = (Model, filter, data) => Model.findOneAndUpdate(
  filter,
  { $set: data },
  { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
);

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI must be configured before running the seed script");

  await mongoose.connect(uri);
  const password = await bcrypt.hash("Password@123", 10);
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const company = await upsert(Company, { email: "demo@acmecrm.in" }, {
    name: "Acme CRM Demo", email: "demo@acmecrm.in", phone: "+91 98765 43210",
    website: "https://acmecrm.in", status: "ACTIVE",
    address: { street: "MG Road", city: "Bengaluru", state: "Karnataka", country: "India", zipCode: "560001" },
    subscription: { plan: "PRO", expiresAt: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()), maxUsers: 50 }
  });
  const companyId = company._id;

  await upsert(Settings, { companyId }, {
    companyId, company: { name: company.name, email: company.email, phone: company.phone, website: company.website, address: "MG Road, Bengaluru", gstNumber: "29ABCDE1234F1Z5" },
    currency: "INR", timezone: "Asia/Kolkata", language: "en", theme: "light", invoice: { prefix: "ACME-INV-", startingNumber: 1001, terms: "Payment due within 15 days." }
  });
  const branch = await upsert(Branch, { companyId, code: "BLR-HQ" }, { companyId, code: "BLR-HQ", name: "Bengaluru Head Office", manager: "Aarav Sharma", city: "Bengaluru", phone: company.phone, email: company.email, address: "MG Road", status: "Active" });
  const department = await upsert(Department, { companyId, code: "SALES" }, { companyId, branchId: branch._id, code: "SALES", name: "Sales", head: "Aarav Sharma", status: "Active", description: "Lead conversion and account growth" });
  const designation = await upsert(Designation, { companyId, code: "SALES-EXEC" }, { companyId, code: "SALES-EXEC", name: "Sales Executive", status: "Active", description: "Owns lead follow-ups and meetings" });

  const permissions = ["leads:read", "leads:create", "leads:update", "customers:read", "customers:create", "quotations:read", "quotations:create", "quotations:update", "invoices:read", "invoices:create", "payments:read", "payments:create", "tasks:read", "tasks:create", "tickets:read", "tickets:create"];
  await upsert(Role, { companyId, code: "COMPANY_ADMIN" }, { companyId, code: "COMPANY_ADMIN", name: "Company Admin", description: "Demo company administrator", permissions, isSystemDefault: true });
  await upsert(Role, { companyId, code: "SALES_EXECUTIVE" }, { companyId, code: "SALES_EXECUTIVE", name: "Sales Executive", description: "Demo sales role", permissions: ["leads:read", "leads:update", "customers:read", "quotations:read", "tasks:read"] });

  const admin = await upsert(User, { email: "admin@acmecrm.in" }, { firstName: "Aarav", lastName: "Sharma", email: "admin@acmecrm.in", phone: "+91 98765 43001", password, role: "COMPANY_ADMIN", companyId, branchId: branch._id, departmentId: department._id, employeeCode: "ACME-001", isActive: true, isVerified: true, permissions });
  const salesUser = await upsert(User, { email: "sales@acmecrm.in" }, { firstName: "Priya", lastName: "Nair", email: "sales@acmecrm.in", phone: "+91 98765 43002", password, role: "SALES_EXECUTIVE", companyId, branchId: branch._id, departmentId: department._id, designationId: designation._id, employeeCode: "ACME-002", isActive: true, isVerified: true });

  const product = await upsert(Product, { sku: "CRM-PRO-ANNUAL" }, { companyId, name: "CRM Pro Annual License", sku: "CRM-PRO-ANNUAL", category: "Software", unit: "license", tax: 18, price: 50000, cost: 15000, stock: 100, isActive: true });
  const customer = await upsert(Customer, { companyId, email: "contact@globex.in" }, { companyId, companyName: "Globex Industries", contactPerson: "Rohan Mehta", email: "contact@globex.in", phone: "+91 98765 43100", industry: "Manufacturing", tags: ["Enterprise", "Demo"], assignedTo: salesUser._id, status: "ACTIVE" });
  const lead = await upsert(Lead, { companyId, email: "contact@globex.in" }, { companyId, title: "Globex CRM Modernization", contactPerson: "Rohan Mehta", email: "contact@globex.in", phone: "+91 98765 43100", companyName: "Globex Industries", source: "WEBSITE", status: "WON", leadScore: 92, assignedTo: salesUser._id, assignedBy: admin._id, notes: [{ text: "Customer approved the annual CRM proposal.", authorName: "Priya Nair", createdAt: now }], timeline: [{ activity: "Lead created", performedBy: "Priya Nair", timestamp: now }, { activity: "Deal won", performedBy: "Aarav Sharma", timestamp: now }] });
  await upsert(Followup, { companyId, leadId: lead._id, title: "Post-sale onboarding call" }, { companyId, leadId: lead._id, leadName: lead.contactPerson, company: lead.companyName, assignedToName: "Priya Nair", type: "call", title: "Post-sale onboarding call", dueDate: tomorrow, status: "pending", priority: "high", channel: "Phone Call" });
  await upsert(Task, { companyId, leadId: lead._id, title: "Prepare onboarding checklist" }, { companyId, leadId: lead._id, title: "Prepare onboarding checklist", description: "Prepare customer onboarding and migration steps.", priority: "HIGH", deadline: tomorrow, status: "PENDING", assignedTo: salesUser._id, createdBy: admin._id, comments: [{ userId: admin._id, userName: "Aarav Sharma", text: "Coordinate the kickoff meeting.", createdAt: now }] });
  await upsert(Meeting, { companyId, title: "Globex CRM Kickoff" }, { companyId, title: "Globex CRM Kickoff", agenda: "Implementation plan and onboarding milestones", leadId: lead._id, customerId: customer._id, scheduledAt: tomorrow, durationMinutes: 45, meetingPlatform: "GOOGLE_MEET", meetingLink: "https://meet.google.com/acme-demo", attendees: [{ name: "Rohan Mehta", email: customer.email }], organizer: salesUser._id, status: "SCHEDULED" });
  await upsert(Deal, { companyId, leadId: lead._id, title: "Globex CRM Annual Deal" }, { companyId, title: "Globex CRM Annual Deal", leadId: lead._id, customerId: customer._id, stage: "WON", dealValue: 59000, probability: 100, expectedClosingDate: now, assignedTo: salesUser._id });
  const quotation = await upsert(Quotation, { quotationNumber: "ACME-QT-1001" }, { companyId, quotationNumber: "ACME-QT-1001", customerId: customer._id, items: [{ name: product.name, quantity: 1, unitPrice: product.price, taxRate: product.tax, totalAmount: 59000 }], subTotal: 50000, taxTotal: 9000, grandTotal: 59000, status: "ACCEPTED", validUntil: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()), createdBy: salesUser._id });
  const invoice = await upsert(Invoice, { invoiceNumber: "ACME-INV-1001" }, { companyId, invoiceNumber: "ACME-INV-1001", quotationId: quotation._id, customerId: customer._id, items: [{ name: product.name, quantity: 1, unitPrice: product.price, gstRate: product.tax, totalAmount: 59000 }], subTotal: 50000, gstTotal: 9000, grandTotal: 59000, paymentStatus: "PAID", dueDate: tomorrow, createdBy: admin._id });
  await upsert(Payment, { invoiceId: invoice._id, transactionId: "DEMO-UPI-1001" }, { companyId, invoiceId: invoice._id, amount: 59000, paymentDate: now, paymentMethod: "UPI", transactionId: "DEMO-UPI-1001", status: "SUCCESS", notes: "Demo payment received" });
  await upsert(Ticket, { ticketNumber: "ACME-TKT-1001" }, { companyId, ticketNumber: "ACME-TKT-1001", customerId: customer._id, subject: "Need onboarding assistance", description: "Please share the implementation checklist.", priority: "MEDIUM", status: "OPEN", assignedTo: salesUser._id });
  await upsert(Notification, { companyId, userId: salesUser._id, title: "New onboarding task" }, { companyId, userId: salesUser._id, title: "New onboarding task", body: "Globex kickoff is scheduled for tomorrow.", channel: "In-app", read: false });
  await upsert(AuditLog, { companyId, userId: admin._id, action: "DEMO_SEED" }, { companyId, userId: admin._id, action: "DEMO_SEED", module: "System", details: "Complete CRM demo data seeded", ipAddress: "127.0.0.1", userAgent: "CRM Seeder" });
  await upsert(Inquiry, { email: "visitor@globex.in" }, { name: "Demo Visitor", mobile: "+91 98765 43211", email: "visitor@globex.in", isVerified: true, messages: [{ role: "user", text: "I need a CRM demo.", createdAt: now }, { role: "model", text: "Our sales team will contact you shortly.", createdAt: now }] });

  console.log(`Seed complete for ${company.name}. Login: admin@acmecrm.in / Password@123`);
};

run()
  .catch((error) => { console.error("Seed failed:", error.message); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
