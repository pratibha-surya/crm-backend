import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import app from "./app.js";

// Models
import Company from "./src/models/Company.model.js";
import User from "./src/models/User.model.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("=== STARTING STEP-BY-STEP CRM PIPELINE WORKFLOW TEST ===\n");

  // Setup Database
  console.log("Step 0: Initializing In-Memory Database...");
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log("✓ MongoDB Connected to: " + uri);

  // Setup Mock Entities
  const company = await Company.create({ name: "Acme Corp", email: "info@acme.com" });
  const user = await User.create({
    companyId: company._id,
    firstName: "Sales",
    lastName: "Agent",
    email: "agent@acme.com",
    password: "password123",
    role: "SUPER_ADMIN",
    status: "ACTIVE"
  });

  const token = jwt.sign(
    {
      id: user._id.toString(),
      role: "SUPER_ADMIN",
      email: "agent@acme.com",
      companyId: company._id.toString()
    },
    "fallback_crm_secret_key_123"
  );
  console.log("✓ Created Mock Company ID: " + company._id);
  console.log("✓ Created Mock User ID: " + user._id);
  console.log("✓ Generated JWT Authorization Token\n");

  await sleep(1500);

  // 1. Create Lead
  console.log("--------------------------------------------------");
  console.log("Step 1: Creating Lead...");
  const leadPayload = {
    title: "Big Enterprise Licensing deal",
    contactPerson: "Aditya Kumar",
    email: "aditya@client.com",
    phone: "+91 9898989898",
    companyName: "Client Tech Solutions",
    source: "GOOGLE_ADS",
    status: "NEW"
  };
  console.log("Sending POST /api/v1/leads with body:", JSON.stringify(leadPayload, null, 2));
  let res = await request(app)
    .post("/api/v1/leads")
    .set("Authorization", `Bearer ${token}`)
    .send(leadPayload);
  
  console.log("Response Status:", res.status);
  console.log("Response Data:", JSON.stringify(res.body, null, 2));
  const leadId = res.body.data._id;
  console.log("\nPressing next step in 2 seconds...");
  await sleep(2000);

  // 2. Assign Task
  console.log("--------------------------------------------------");
  console.log("Step 2: Assigning Lead Task...");
  const taskPayload = {
    title: "Schedule call with Aditya",
    description: "Follow up on software specifications",
    priority: "HIGH",
    assignedTo: user._id.toString(),
    leadId: leadId
  };
  console.log("Sending POST /api/v1/tasks with body:", JSON.stringify(taskPayload, null, 2));
  res = await request(app)
    .post("/api/v1/tasks")
    .set("Authorization", `Bearer ${token}`)
    .send(taskPayload);
  
  console.log("Response Status:", res.status);
  console.log("Response Data:", JSON.stringify(res.body, null, 2));
  console.log("\nPressing next step in 2 seconds...");
  await sleep(2000);

  // 3. Update Status
  console.log("--------------------------------------------------");
  console.log("Step 3: Updating Lead Status to CONTACTED...");
  console.log(`Sending PATCH /api/v1/leads/${leadId}/status with status: CONTACTED`);
  res = await request(app)
    .patch(`/api/v1/leads/${leadId}/status`)
    .set("Authorization", `Bearer ${token}`)
    .send({ status: "CONTACTED" });
  
  console.log("Response Status:", res.status);
  console.log("Response Data:", JSON.stringify(res.body, null, 2));
  console.log("\nPressing next step in 2 seconds...");
  await sleep(2000);

  // 4. Meeting Schedule
  console.log("--------------------------------------------------");
  console.log("Step 4: Scheduling a Meeting...");
  const meetingPayload = {
    title: "ERP Live Demo",
    agenda: "Show ERP dashboard and reports live",
    leadId: leadId,
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 30,
    meetingPlatform: "ZOOM",
    attendees: [{ email: "aditya@client.com", name: "Aditya Kumar" }]
  };
  console.log("Sending POST /api/v1/meetings with body:", JSON.stringify(meetingPayload, null, 2));
  res = await request(app)
    .post("/api/v1/meetings")
    .set("Authorization", `Bearer ${token}`)
    .send(meetingPayload);
  
  console.log("Response Status:", res.status);
  console.log("Response Data:", JSON.stringify(res.body, null, 2));
  console.log("\nPressing next step in 2 seconds...");
  await sleep(2000);

  // 5. Followup if busy
  console.log("--------------------------------------------------");
  console.log("Step 5: Client is busy - Scheduling Followup Task...");
  const followupPayload = {
    title: "Client was busy, retry tomorrow",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    leadId: leadId,
    leadName: "Aditya Kumar",
    company: "Client Tech Solutions",
    type: "call",
    priority: "high",
    channel: "Phone Call"
  };
  console.log("Sending POST /api/v1/followups with body:", JSON.stringify(followupPayload, null, 2));
  res = await request(app)
    .post("/api/v1/followups")
    .set("Authorization", `Bearer ${token}`)
    .send(followupPayload);
  
  console.log("Response Status:", res.status);
  console.log("Response Data:", JSON.stringify(res.body, null, 2));
  console.log("\nPressing next step in 2 seconds...");
  await sleep(2000);

  // 6. Interest Action (Qualified)
  console.log("--------------------------------------------------");
  console.log("Step 6: Update Interest Score & Qualify Lead...");
  console.log(`Sending PUT /api/v1/leads/${leadId} to update score`);
  res = await request(app)
    .put(`/api/v1/leads/${leadId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Big Enterprise Licensing deal",
      contactPerson: "Aditya Kumar",
      leadScore: 95
    });
  
  console.log("Response Status:", res.status);
  console.log("Response Data:", JSON.stringify(res.body, null, 2));

  console.log(`Sending PATCH /api/v1/leads/${leadId}/status with status: QUALIFIED`);
  res = await request(app)
    .patch(`/api/v1/leads/${leadId}/status`)
    .set("Authorization", `Bearer ${token}`)
    .send({ status: "QUALIFIED" });
  console.log("Response Status:", res.status);
  console.log("Response Data:", JSON.stringify(res.body, null, 2));
  console.log("\nPressing next step in 2 seconds...");
  await sleep(2000);

  // 7. Deal Creation
  console.log("--------------------------------------------------");
  console.log("Step 7: Creating Customer and Converting to Deal...");
  const customerPayload = {
    companyName: "Client Tech Solutions",
    contactPerson: "Aditya Kumar",
    email: "aditya@client.com",
    phone: "+91 9898989898",
    status: "ACTIVE"
  };
  console.log("Sending POST /api/v1/customers with body:", JSON.stringify(customerPayload, null, 2));
  const custRes = await request(app)
    .post("/api/v1/customers")
    .set("Authorization", `Bearer ${token}`)
    .send(customerPayload);
  const custId = custRes.body.data._id;
  console.log("Created Customer ID:", custId);

  const dealPayload = {
    title: "Client Tech Solutions ERP Enterprise Deal",
    customerId: custId,
    leadId: leadId,
    stage: "PROPOSAL",
    dealValue: 20000,
    probability: 80
  };
  console.log("Sending POST /api/v1/deals with body:", JSON.stringify(dealPayload, null, 2));
  res = await request(app)
    .post("/api/v1/deals")
    .set("Authorization", `Bearer ${token}`)
    .send(dealPayload);
  
  console.log("Response Status:", res.status);
  console.log("Response Data:", JSON.stringify(res.body, null, 2));
  console.log("\nPressing next step in 2 seconds...");
  await sleep(2000);

  // 8. Invoice and Payment
  console.log("--------------------------------------------------");
  console.log("Step 8: Generating Invoice and Logging Payment...");
  const invoicePayload = {
    invoiceNumber: "INV-" + Date.now(),
    customerId: custId,
    items: [
      {
        name: "ERP License Suite",
        quantity: 1,
        unitPrice: 20000,
        gstRate: 18,
        totalAmount: 23600
      }
    ],
    subTotal: 20000,
    gstTotal: 3600,
    grandTotal: 23600,
    paymentStatus: "UNPAID",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
  };
  console.log("Sending POST /api/v1/invoices with body:", JSON.stringify(invoicePayload, null, 2));
  const invRes = await request(app)
    .post("/api/v1/invoices")
    .set("Authorization", `Bearer ${token}`)
    .send(invoicePayload);
  const invoiceId = invRes.body.data._id;
  console.log("Created Invoice ID:", invoiceId);

  const paymentPayload = {
    invoiceId: invoiceId,
    amount: 23600,
    paymentMethod: "UPI",
    transactionId: "TXN-UPI-" + Date.now(),
    status: "SUCCESS",
    notes: "Step-by-step run completed payment."
  };
  console.log("Sending POST /api/v1/payments with body:", JSON.stringify(paymentPayload, null, 2));
  res = await request(app)
    .post("/api/v1/payments")
    .set("Authorization", `Bearer ${token}`)
    .send(paymentPayload);
  
  console.log("Response Status:", res.status);
  console.log("Response Data:", JSON.stringify(res.body, null, 2));

  // Clean up
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log("\n=== ALL STEPS EXECUTED SUCCESSFULY ===");
}

run().catch(console.error);
