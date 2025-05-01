import { NextResponse } from "next/server";

import { generateAvailableSlots } from "@/lib/google/utils";

/**
 * GET /api/available-slots
 * Returns all available 30-minute time slots between now and 4 (28 days) weeks out,
 * grouped by date and respecting the clinic's working hours.
 */
export async function GET() {
  try {
    const timezone = "America/Los_Angeles";
    const timeMin = new Date().toISOString();
    const timeMax = new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000
    ).toISOString();

    // Define clinic working hours (24-hour format)
    const workingHours = { startHour: 9, endHour: 17 }; // 9:00 AM to 5:00 PM

    const rawSlots = await generateAvailableSlots(
      timeMin,
      timeMax,
      timezone,
      workingHours
    );

    // Group available slots by date into { date, slots[] } format
    const grouped: Record<string, string[]> = {};
    for (const slot of rawSlots) {
      const [datePart, timePart] = slot.start.split("T");
      const time = timePart.slice(0, 5); // "HH:MM"
      if (!grouped[datePart]) grouped[datePart] = [];
      grouped[datePart].push(time);
    }

    const slots = Object.entries(grouped).map(([date, slots]) => ({
      date,
      slots,
    }));

    return NextResponse.json(slots);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}
