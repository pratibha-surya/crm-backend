import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CRM Pro - Customer Relationship Management API",
      version: "1.0.0",
      description: "Live Software Requirements Specification (SRS) compliant Backend API Documentation covering all 20 modules."
    },
    tags: [
      {
        name: "01. Authentication",
        description: "STEP 1: Register, login, forgot/reset password, and verification (Module 1)"
      },
      // {
      //   name: "20. Role & Permission",
      //   description: "STEP 2: Define system roles, fine-grained access rules, and permissions matrix (Module 20)\n\n| Role | Permissions |\n| --- | --- |\n| Super Admin | Sab kuch access |\n| Admin | Company ke sabhi leads manage |\n| Sales Manager | Team ki leads assign aur monitor |\n| Sales Executive | Sirf apni assigned leads |\n| Support | Lead dekh sakta hai, edit nahi |"
      // },
      {
        name: "03. User Management",
        description: "STEP 3: Add employees, branches, departments, designations (Module 3)"
      },
      {
        name: "11. Product Management",
        description: "STEP 4: Set up catalog products, category tags, SKU identification, pricing, and stock (Module 11)"
      },
      {
        name: "21. Inquiries & Chat",
        description: "STEP 5: Manage incoming public widget inquiries, verification, and chat session messaging (Module 21)"
      },
      {
        name: "05. Lead Management",
        description: "STEP 6: Capture new leads, scores, timeline logs, and pipeline status updates (Module 5)"
      },
      {
        name: "08. Task Management",
        description: "STEP 7: Schedule follow-up tasks, assign tasks, prioritize, add comments, and attach logs (Module 8)"
      },
      {
        name: "07. Meeting Management",
        description: "STEP 8: Set up Google Meet/Zoom demos, attendee listings, and minutes of meetings (Module 7)"
      },
      {
        name: "09. Quotations",
        description: "STEP 9: Create pricing proposals, apply discounts/taxes, and convert accepted quotes to invoice (Module 9)"
      },
      {
        name: "06. Deal Management",
        description: "STEP 10: Track opportunities, deal valuations, forecasting, and pipeline closures (Module 6)"
      },
      {
        name: "04. Customer Management",
        description: "STEP 11: Build customer profiles, logs, and activity history for won opportunities (Module 4)"
      },
      {
        name: "10. Invoice",
        description: "STEP 12: Generate billing invoices, calculate tax rates, and track invoice payments (Module 10)"
      },
      {
        name: "13. Support Tickets",
        description: "STEP 13: Handle client support desk tickets, resolve queries, and log replies (Module 13)"
      },
      {
        name: "02. Dashboard",
        description: "ANALYTICS: View business stats, monthly performance charts, and recent activity feeds (Module 2)"
      },
      {
        name: "17. Reports",
        description: "REPORTS: Export CSV files for sales performance, payments, and conversion rates (Module 17)"
      },
      {
        name: "18. Audit Log",
        description: "HISTORY: Log system modifications, authentication history, IP addresses, and browsers (Module 18)"
      },
      {
        name: "19. Settings",
        description: "SETUP: Customize branding, localization currencies, timezone settings, and SMTP servers (Module 19)"
      }
    ],
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Localhost Development Server"
      },
      {
        url: "http://192.168.1.2:5000/api/v1",
        description: "Network Host Server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token directly without 'Bearer ' prefix (e.g. eyJhbGci...)"
        }
      }
    },
    apis: ["./src/routes/*.js"]
  },
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
