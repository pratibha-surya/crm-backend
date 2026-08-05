import Meeting from "../models/Meeting.model.js";
import Followup from "../models/Followup.model.js";
import nodemailer from "nodemailer";

const createTransporter = () => {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

const sendEmail = async (to, subject, html) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn(`[Reminder Scheduler] Skipping email to <${to}>: SMTP credentials not set.`);
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    return true;
  } catch (error) {
    console.error(`[Reminder Scheduler] Error sending email to ${to}:`, error.message);
    return false;
  }
};

export const checkReminders = async () => {
  const now = new Date();

  // 1. Process Meetings Reminders
  try {
    const upcomingMeetings = await Meeting.find({
      status: "SCHEDULED",
      reminderSent: false
    }).populate("organizer", "firstName lastName email");

    for (const meeting of upcomingMeetings) {
      const minutesBefore = meeting.reminderMinutesBefore || 15;
      const triggerTime = new Date(meeting.scheduledAt.getTime() - minutesBefore * 60 * 1000);

      if (now >= triggerTime) {
        // Send email to organizer
        if (meeting.organizer?.email) {
          const subject = `🔔 Reminder: Meeting "${meeting.title}" starts soon`;
          const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Upcoming Meeting Reminder</h2>
              <p>Hello ${meeting.organizer.firstName},</p>
              <p>This is a reminder that your meeting is scheduled to start soon.</p>
              <hr/>
              <p><strong>Title:</strong> ${meeting.title}</p>
              <p><strong>Platform:</strong> ${meeting.meetingPlatform}</p>
              <p><strong>Time:</strong> ${meeting.scheduledAt.toLocaleString()}</p>
              ${meeting.meetingLink ? `<p><strong>Link:</strong> <a href="${meeting.meetingLink}">${meeting.meetingLink}</a></p>` : ""}
              ${meeting.agenda ? `<p><strong>Agenda:</strong> ${meeting.agenda}</p>` : ""}
            </div>
          `;
          await sendEmail(meeting.organizer.email, subject, html);
        }

        // Send email to attendees
        for (const attendee of meeting.attendees || []) {
          if (attendee.email) {
            const subject = `🔔 Invitation Reminder: "${meeting.title}" starts soon`;
            const html = `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Meeting Reminder</h2>
                <p>Hello ${attendee.name || "Attendee"},</p>
                <p>You are invited to the following upcoming meeting:</p>
                <hr/>
                <p><strong>Title:</strong> ${meeting.title}</p>
                <p><strong>Platform:</strong> ${meeting.meetingPlatform}</p>
                <p><strong>Time:</strong> ${meeting.scheduledAt.toLocaleString()}</p>
                ${meeting.meetingLink ? `<p><strong>Join Link:</strong> <a href="${meeting.meetingLink}">${meeting.meetingLink}</a></p>` : ""}
              </div>
            `;
            await sendEmail(attendee.email, subject, html);
          }
        }

        // Update state to prevent resending
        meeting.reminderSent = true;
        await meeting.save();
        console.log(`[Reminder Scheduler] Sent meeting reminders for "${meeting.title}"`);
      }
    }
  } catch (error) {
    console.error("[Reminder Scheduler] Error processing meetings:", error.message);
  }

  // 2. Process Follow-ups Reminders
  try {
    const upcomingFollowups = await Followup.find({
      status: "pending",
      reminderSent: false
    });

    for (const followup of upcomingFollowups) {
      // Trigger if due date is within next 24 hours
      const triggerTime = new Date(followup.dueDate.getTime() - 24 * 60 * 60 * 1000);

      if (now >= triggerTime) {
        // Send alert to the assigned rep or general team
        const alertEmail = process.env.EMAIL_USER; // Default alert recipient
        if (alertEmail) {
          const subject = `🔔 Action Required: Follow-up due for "${followup.leadName}"`;
          const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Pending Follow-up Alert</h2>
              <p>The following follow-up task is scheduled for action within 24 hours:</p>
              <hr/>
              <p><strong>Title:</strong> ${followup.title}</p>
              <p><strong>Lead Name:</strong> ${followup.leadName}</p>
              <p><strong>Priority:</strong> ${followup.priority.toUpperCase()}</p>
              <p><strong>Channel:</strong> ${followup.channel}</p>
              <p><strong>Due Date:</strong> ${followup.dueDate.toLocaleString()}</p>
            </div>
          `;
          await sendEmail(alertEmail, subject, html);
        }

        followup.reminderSent = true;
        await followup.save();
        console.log(`[Reminder Scheduler] Sent follow-up alert for "${followup.title}"`);
      }
    }
  } catch (error) {
    console.error("[Reminder Scheduler] Error processing followups:", error.message);
  }
};

export const startReminderScheduler = () => {
  console.log("⏰ Background Reminder Scheduler Worker started.");
  // Run once immediately on start, then scan every 60 seconds
  checkReminders();
  setInterval(checkReminders, 60 * 1000);
};
