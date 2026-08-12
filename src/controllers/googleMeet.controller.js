import asyncHandler from "../utils/asyncHandler.js";
import { connectGoogleAccount, getGoogleAuthorizationUrl } from "../services/googleMeet.service.js";

export const startGoogleConnection = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { authorizationUrl: getGoogleAuthorizationUrl(req.user._id) } });
});

export const finishGoogleConnection = asyncHandler(async (req, res) => {
  if (req.query.error) throw new Error("Google account connection was cancelled");
  await connectGoogleAccount(req.query.code, req.query.state);
  res.type("html").send("<script>window.close()</script><p>Google Calendar connected. You can close this window.</p>");
});
