import AuditLog from "../models/AuditLog.model.js";

export const getAuditLogsService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await AuditLog.find(filter)
    .populate("userId", "firstName lastName email")
    .sort({ createdAt: -1 });
};

export const logActionService = async (companyId, userId, action, moduleName, details, ip, ua) => {
  return await AuditLog.create({
    companyId,
    userId,
    action,
    module: moduleName,
    details,
    ipAddress: ip,
    userAgent: ua
  });
};
