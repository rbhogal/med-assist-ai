import { NextResponse } from "next/server";
import { format, toZonedTime } from "date-fns-tz";
import { google } from "googleapis";

import { SlotRange } from "@/types/booking";

interface AvailabilityOptions {
  durationMinutes?: number;
  timeMin?: string; // ISO string
  timeMax?: string; // ISO string
  workingHours?: { start: string; end: string }; // e.g. { start: "09:00", end: "17:00" }
  timezone?: string;
}

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!),
  scopes: SCOPES,
});
export const calendar = google.calendar({ version: "v3", auth });
export const calendarId = process.env.GOOGLE_CALENDAR_ID!;

export async function generateAvailableSlots(
  timeMin: string,
  timeMax: string,
  timezone: string,
  workingHours: { startHour: number; endHour: number }
): Promise<SlotRange[]> {
  // fetch busy times from google calender
  const busy = await getBusyTimes(timeMin, timeMax, timezone);

  // Generate available slots (30-min increments) within working hours
  const slotDuration = 30; // minutes
  const rawSlots: SlotRange[] = [];
  let cursor = new Date(timeMin);
  cursor = toZonedTime(cursor, timezone); // convert to PST

  // Round cursor up to the next 30-minute increment
  const minutes = cursor.getMinutes();
  const remainder = minutes % 30;
  if (remainder !== 0) {
    const increment = 30 - remainder;
    cursor.setMinutes(minutes + increment, 0, 0);
  }

  const windowEnd = new Date(timeMax);

  // Align cursor to clinic opening if before working hours
  if (cursor.getHours() < workingHours.startHour) {
    cursor.setHours(workingHours.startHour, 0, 0, 0);
  }

  // Advance through each day in the window
  while (cursor < windowEnd) {
    const hour = cursor.getHours();
    const dayOfWeek = cursor.getDay();

    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(workingHours.startHour, 0, 0, 0);
      continue;
    }

    // If past clinic closing, jump to next day at opening
    if (hour >= workingHours.endHour) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(workingHours.startHour, 0, 0, 0);
      continue;
    }

    // convert to PST
    const next = new Date(cursor.getTime() + slotDuration * 60 * 1000);
    const startISO = format(cursor, "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: timezone,
    });
    const endISO = format(next, "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: timezone,
    });

    // Skip slots that span outside working hours
    if (next.getHours() >= workingHours.endHour && next.getMinutes() > 0) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(workingHours.startHour, 0, 0, 0);
      continue;
    }

    const zonedCursor = toZonedTime(cursor, timezone);
    const zonedNext = toZonedTime(next, timezone);

    const isBusy = busy.some(({ start, end }) => {
      const busyStart = new Date(start);
      const busyEnd = new Date(end);
      return zonedCursor < busyEnd && zonedNext > busyStart;
    });

    if (!isBusy) {
      rawSlots.push({ start: startISO, end: endISO });
    }

    // advance by slot duration
    cursor.setMinutes(cursor.getMinutes() + slotDuration);
  }

  return rawSlots;
}

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

type BusyTime = { start: string; end: string };

const getBusyTimes = async (
  timeMin: string,
  timeMax: string,
  timezone: string
): Promise<BusyTime[]> => {
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

  const filteredBusyTimes: BusyTime[] = busyTimes.filter(
    (b): b is BusyTime =>
      typeof b.start === "string" && typeof b.end === "string"
  );

  return filteredBusyTimes;
};

type TimeSlot = {
  start: string; // ISO string (e.g., '2025-04-16T16:00:00Z')
  end: string; // ISO string (e.g., '2025-04-16T16:30:00Z')
};

async function getAvailableTimeSlots({
  start,
  end,
  busy,
}: {
  start: Date;
  end: Date;
  busy: Array<{ start: string; end: string }>; // Busy times are arrays of objects
}): Promise<NextResponse<TimeSlot[]>> {
  // 1. Set up the slot duration you want, e.g., 30-minute intervals.
  const slotDuration = 30; // minutes
  const availableSlots: TimeSlot[] = [];

  // 2. Create time slots between start and end time
  const currentTime = new Date(start);
  while (currentTime < end) {
    const nextTime = new Date(currentTime.getTime() + slotDuration * 60000); // Add slot duration to current time

    // Convert to ISO strings to standardize time format
    const currentTimeISO = currentTime.toISOString();
    const nextTimeISO = nextTime.toISOString();

    // 3. Check if the current slot overlaps with any busy times
    const isBusy = busy.some((busyTime) => {
      const busyStart = new Date(busyTime.start).toISOString();
      const busyEnd = new Date(busyTime.end).toISOString();
      return (
        currentTimeISO < busyEnd && nextTimeISO > busyStart // If the slot overlaps with a busy time
      );
    });

    // 4. If the slot is not busy, add it to the available slots list
    if (!isBusy) {
      availableSlots.push({
        start: currentTimeISO,
        end: nextTimeISO,
      });
    }

    // Move to the next slot
    currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
  }

  return NextResponse.json(availableSlots);
}

const findEarliestAvailability = async ({
  durationMinutes = 30,
  timeMin = new Date().toISOString(),
  timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  workingHours = { start: "09:00", end: "17:00" },
  timezone = "America/Los_Angeles",
}: AvailabilityOptions): Promise<string | null> => {
  const busyTimes = await getBusyTimes(timeMin, timeMax, timezone);
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

const checkTimeAvailability = async ({
  proposedTime,
  durationMinutes = 30,
  timeMin = new Date().toISOString(),
  timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  timezone = "America/Los_Angeles",
}: {
  proposedTime: string; // proposed time in ISO string format
  durationMinutes?: number;
  timeMin?: string;
  timeMax?: string;
  timezone?: string;
}): Promise<boolean> => {
  const busyTimes = await getBusyTimes(timeMin, timeMax, timezone);
  const proposedStart = new Date(proposedTime);
  const proposedEnd = new Date(
    proposedStart.getTime() + durationMinutes * 60 * 1000
  );

  // Check if the proposed time overlaps with any busy time
  const overlap = busyTimes.some((b) => {
    const busyStart = new Date(b.start as string);
    const busyEnd = new Date(b.end as string);
    return proposedStart < busyEnd && proposedEnd > busyStart; // checks for overlap
  });

  return !overlap; // If no overlap, return true (i.e., the time is available)
};

export {
  createGoogleCalenderEvent,
  findEarliestAvailability,
  checkTimeAvailability,
  getAvailableTimeSlots,
  getBusyTimes,
};
