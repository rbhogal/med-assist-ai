import { NextResponse } from "next/server";
import { getBusyTimes } from "@/lib/google/utils";
import { format, toZonedTime } from "date-fns-tz";

/**
 * A time slot interval with ISO start/end
 */
export type TimeSlot = {
  start: string;
  end: string;
};

/**
 * GET /api/available-slots
 * Returns all available 30-minute time slots between now and 4 (28 days) weeks out,
 * grouped by date and respecting the clinic's working hours.
 */
export async function GET() {
  try {
    const timeMin = new Date().toISOString();
    const timeMax = new Date(
      Date.now() + 28 * 24 * 60 * 60 * 1000
    ).toISOString();
    const timezone = "America/Los_Angeles";

    // 📅 Define clinic working hours (24-hour format)
    const workingHours = { startHour: 9, endHour: 17 }; // 9:00 AM to 5:00 PM

    // 2️⃣ Fetch busy times from Google Calendar
    const busy = await getBusyTimes(timeMin, timeMax, timezone);
    console.log({ busy });

    // 3️⃣ Generate available slots (30-min increments) within working hours
    const slotDuration = 30; // minutes
    const rawSlots: TimeSlot[] = [];
    let cursor = new Date(timeMin);
    cursor = toZonedTime(cursor, timezone);
    const windowEnd = new Date(timeMax);

    // Align cursor to clinic opening if before working hours
    if (cursor.getHours() < workingHours.startHour) {
      cursor.setHours(workingHours.startHour, 0, 0, 0);
    }

    // Advance through each day in the window
    while (cursor < windowEnd) {
      const hour = cursor.getHours();

      // If past clinic closing, jump to next day at opening
      if (hour >= workingHours.endHour) {
        cursor.setDate(cursor.getDate() + 1);
        cursor.setHours(workingHours.startHour, 0, 0, 0);
        continue;
      }

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

      // Check if this slot overlaps any busy time
      const isBusy = busy.some(({ start, end }) => {
        return startISO < end && endISO > start;
      });

      if (!isBusy) {
        rawSlots.push({ start: startISO, end: endISO });
      }

      // advance by slot duration
      cursor.setMinutes(cursor.getMinutes() + slotDuration);
    }

    // 4️⃣ Group available slots by date into { date, slots[] } format
    const grouped: Record<string, string[]> = {};
    for (const slot of rawSlots) {
      const [datePart, timePart] = slot.start.split("T");
      const time = timePart.slice(0, 5); // "HH:MM"
      if (!grouped[datePart]) grouped[datePart] = [];
      grouped[datePart].push(time);
    }

    const transformed = Object.entries(grouped).map(([date, slots]) => ({
      date,
      slots,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}
