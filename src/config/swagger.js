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
        description: "Login, Forgot Password, Reset Password, OTP verification (Module 1)"
      },
      {
        name: "02. Dashboard",
        description: "Overview statistics, Monthly performance charts, recent activity feed (Module 2)"
      },
      {
        name: "03. User Management",
        description: "Employees, Roles, Branches, Departments, Designations, Attendance & Leaves (Module 3)"
      },
      {
        name: "04. Customer Management",
        description: "Customer profiling, contact details, notes, activities history (Module 4)"
      },
      {
        name: "05. Lead Management",
        description: "Lead captures, scores, timeline logs, follow-up alerts, CSV exports/imports (Module 5)"
      },
      {
        name: "06. Deal Management",
        description: "Sales Pipeline, Kanban board updates, Deal valuation, Expected closings, Forecasting (Module 6)"
      },
      {
        name: "07. Meeting Management",
        description: "Google Meet & Zoom integrations, agendas, attendee listings, minutes of meetings (Module 7)"
      },
      {
        name: "08. Task Management",
        description: "Daily tasking CRUD, priorities, comments thread, attachments, recurring logs (Module 8)"
      },
      {
        name: "09. Quotations",
        description: "Proposals, pricing discounts, tax listings, and converting quotes to invoice (Module 9)"
      },
      {
        name: "10. Invoice",
        description: "Billing invoices, GST listings, payment gateway references, and status tracking (Module 10)"
      },
      {
        name: "11. Product Management",
        description: "Product directory, category tags, SKU identification, pricing, barcode, image (Module 11)"
      },
      {
        name: "13. Support Tickets",
        description: "Support desk tickets routing, priority levels, assignment, replies log (Module 13)"
      },
      {
        name: "17. Reports",
        description: "CSV reports export system for sales, payments, personnel stats, and conversions (Module 17)"
      },
      {
        name: "18. Audit Log",
        description: "User authentication records history, modification, IP, and browser tracking (Module 18)"
      },
      {
        name: "19. Settings",
        description: "Branding, localization currency/timezone/languages, SMTP, API keys (Module 19)"
      },
      {
        name: "20. Role & Permission",
        description: "System roles, fine-grained access rules, and permissions matrix (Module 20)"
      }
    ],
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Development Server"
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
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
