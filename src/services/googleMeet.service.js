import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";

const GOOGLE_CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";

const getConfig = () => {
  const { GOOGLE_MEET_ENABLED, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_CALENDAR_ID = "primary", JWT_SECRET } = process.env;
  if (GOOGLE_MEET_ENABLED !== "true") throw new ApiError(503, "Google Meet integration is disabled");
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI || !JWT_SECRET) {
    throw new ApiError(500, "Google Meet environment variables are not configured");
  }
  return { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_CALENDAR_ID, JWT_SECRET };
};

const getEncryptionKey = () => {
  if (!process.env.GOOGLE_TOKEN_ENCRYPTION_KEY) throw new ApiError(500, "GOOGLE_TOKEN_ENCRYPTION_KEY must be configured");
  return crypto.createHash("sha256").update(process.env.GOOGLE_TOKEN_ENCRYPTION_KEY).digest();
};

const encrypt = (value) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${encrypted.toString("base64url")}`;
};

const decrypt = (value) => {
  const [ivValue, tagValue, encryptedValue] = String(value).split(".");
  if (!ivValue || !tagValue || !encryptedValue) throw new ApiError(409, "Reconnect your Google account");
  const decipher = crypto.createDecipheriv("aes-256-gcm", getEncryptionKey(), Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue, "base64url")), decipher.final()]).toString("utf8");
};

export const getGoogleAuthorizationUrl = (userId) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, JWT_SECRET } = getConfig();
  const state = jwt.sign({ userId, type: "google-meet-oauth" }, JWT_SECRET, { expiresIn: "10m" });
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: GOOGLE_CALENDAR_SCOPE,
    access_type: "offline",
    prompt: "consent",
    state
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

export const connectGoogleAccount = async (code, state) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, JWT_SECRET } = getConfig();
  let payload;
  try {
    payload = jwt.verify(state, JWT_SECRET);
  } catch {
    throw new ApiError(400, "Google authorization session expired. Please try again.");
  }
  if (payload.type !== "google-meet-oauth" || !payload.userId) throw new ApiError(400, "Invalid Google authorization state");

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, redirect_uri: GOOGLE_REDIRECT_URI, grant_type: "authorization_code" })
  });
  const tokens = await tokenResponse.json();
  if (!tokenResponse.ok || !tokens.refresh_token) throw new ApiError(400, "Google did not return offline access. Reconnect and approve access again.");

  await User.findByIdAndUpdate(payload.userId, {
    googleCalendarRefreshToken: encrypt(tokens.refresh_token),
    googleCalendarConnectedAt: new Date()
  });
};

export const createGoogleMeetEvent = async ({ organizerId, title, agenda, scheduledAt, durationMinutes = 30, attendees = [] }) => {
  if (process.env.GOOGLE_MEET_ENABLED !== "true") return null;
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALENDAR_ID } = getConfig();
  const organizer = await User.findById(organizerId).select("+googleCalendarRefreshToken");
  if (!organizer?.googleCalendarRefreshToken) throw new ApiError(409, "Connect the organizer's Google account before scheduling a Google Meet");

  const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, refresh_token: decrypt(organizer.googleCalendarRefreshToken), grant_type: "refresh_token" })
  });
  const token = await refreshResponse.json();
  if (!refreshResponse.ok || !token.access_token) throw new ApiError(409, "Google authorization expired. Reconnect the organizer's Google account");

  const start = new Date(scheduledAt);
  const end = new Date(start.getTime() + Number(durationMinutes || 30) * 60 * 1000);
  const eventResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?conferenceDataVersion=1`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: title,
      description: agenda || "",
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      attendees: attendees.filter((attendee) => attendee.email).map(({ email, name }) => ({ email, displayName: name })),
      conferenceData: { createRequest: { requestId: crypto.randomUUID() } }
    })
  });
  const event = await eventResponse.json();
  const link = event.hangoutLink || event.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri;
  if (!eventResponse.ok || !link) throw new ApiError(502, "Google Calendar could not create a Meet link");
  return link;
};
