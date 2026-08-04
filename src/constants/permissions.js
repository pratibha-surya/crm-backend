const PERMISSIONS = {
  CUSTOMERS: {
    CREATE: "customers:create",
    READ: "customers:read",
    UPDATE: "customers:update",
    DELETE: "customers:delete",
    EXPORT: "customers:export"
  },
  LEADS: {
    CREATE: "leads:create",
    READ: "leads:read",
    UPDATE: "leads:update",
    DELETE: "leads:delete",
    ASSIGN: "leads:assign",
    EXPORT: "leads:export"
  },
  DEALS: {
    CREATE: "deals:create",
    READ: "deals:read",
    UPDATE: "deals:update",
    DELETE: "deals:delete"
  },
  QUOTATIONS: {
    CREATE: "quotations:create",
    READ: "quotations:read",
    UPDATE: "quotations:update",
    CONVERT: "quotations:convert"
  },
  INVOICES: {
    CREATE: "invoices:create",
    READ: "invoices:read",
    UPDATE: "invoices:update",
    PAYMENTS: "invoices:payments"
  },
  TICKETS: {
    CREATE: "tickets:create",
    READ: "tickets:read",
    RESOLVE: "tickets:resolve"
  },
  USERS: {
    CREATE: "users:create",
    READ: "users:read",
    UPDATE: "users:update",
    DELETE: "users:delete"
  }
};

export default PERMISSIONS;
