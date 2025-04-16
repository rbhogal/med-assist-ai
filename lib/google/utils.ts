import { google } from "googleapis";
import path from "path";

interface AvailabilityOptions {
  durationMinutes?: number;
  timeMin?: string; // ISO string
  timeMax?: string; // ISO string
  workingHours?: { start: string; end: string }; // e.g. { start: "09:00", end: "17:00" }
  timezone?: string;
}

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const calendarId = process.env.GOOGLE_CALENDER_ID;
const keyFilePath = path.join(
  process.cwd(),
  process.env.GOOGLE_SERVICE_ACCOUNT_PATH!
);
const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: SCOPES,
});
const calendar = google.calendar({ version: "v3", auth });

const createGoogleCalenderEvent = async () => {
  try {
    const event = {
      summary: "Appointment Booked! 🎉",
      description: "Thanks for trying the Med Assist Demo!",
      start: {
        dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        timeZone: "UTC",
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    return {
      success: true,
      link: response.data.htmlLink,
    };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return {
      error: "Failed to create event",
      success: false,
    };
  }
};

function formatToMonthDay12Hour(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function roundToNextQuarterHour(date: Date): Date {
  const rounded = new Date(date);
  const minutes = rounded.getMinutes();
  const remainder = minutes % 15;

  if (remainder !== 0) {
    rounded.setMinutes(minutes + (15 - remainder));
  }

  rounded.setSeconds(0);
  rounded.setMilliseconds(0);
  return rounded;
}

const findEarliestAvailability = async ({
  durationMinutes = 30,
  timeMin = new Date().toISOString(),
  timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  workingHours = { start: "09:00", end: "17:00" },
  timezone = "America/Los_Angeles",
}: AvailabilityOptions): Promise<string | null> => {
  const freeBusy = await calendar.freebusy.query({
    auth,
    requestBody: {
      timeMin,
      timeMax,
      timeZone: timezone,
      items: [{ id: calendarId }],
    },
  });

  const busyTimes = freeBusy.data.calendars?.[calendarId]?.busy || [];

  const now = roundToNextQuarterHour(new Date(timeMin));
  const end = new Date(timeMax);
  const intervalMs = durationMinutes * 60 * 1000;

  for (
    let current = new Date(now);
    current < end;
    current = new Date(current.getTime() + 15 * 60 * 1000) // check every 15 minutes
  ) {
    const hours = current.getHours();
    const minutes = current.getMinutes();
    const timeStr = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    // Check if inside working hours
    if (timeStr < workingHours.start || timeStr >= workingHours.end) continue;

    const proposedEnd = new Date(current.getTime() + intervalMs);

    const overlap = busyTimes.some((b) => {
      const busyStart = new Date(b.start as string);
      const busyEnd = new Date(b.end as string);
      return current < busyEnd && proposedEnd > busyStart;
    });

    if (!overlap) {
      const currentStr = formatToMonthDay12Hour(current);
      return currentStr;
    }
  }
  return null; // no time found in the range
};

export { createGoogleCalenderEvent, findEarliestAvailability };
