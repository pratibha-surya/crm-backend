import { getAuditLogsService } from "../services/auditLog.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await getAuditLogsService(req.query, req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, logs, "Audit logs fetched successfully"));
});
