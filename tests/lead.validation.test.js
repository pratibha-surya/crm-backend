import test from "node:test";
import assert from "node:assert/strict";

import { validateLeadPayload } from "../src/validators/module.validators.js";
import ApiError from "../src/utils/ApiError.js";

test("validateLeadPayload rejects a lead without a title", () => {
  const req = {
    body: {
      companyId: "000000000000000000000000",
      contactPerson: "Rahul Sharma",
      email: "rahul@acme.com",
      phone: "+91 9876543210"
    },
    user: {
      companyId: "000000000000000000000000"
    }
  };

  const res = {};
  const next = () => {
    throw new Error("next should not be called when payload validation fails");
  };

  assert.throws(
    () => validateLeadPayload(req, res, next),
    (error) => error instanceof ApiError && error.statusCode === 400 && error.message === "Lead title is required"
  );
});
