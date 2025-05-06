import { NextResponse } from "next/server";
import { calendar, calendarId } from "@/lib/google/utils";

export async function POST(req: Request) {
  try {
    const { name, email, slot } = await req.json();

    const event = {
      summary: `${name} - Demo Appointment`,
      location: "123 Demo St. AI City MA, 99999",
      description: `Booked by ${email}`,
      start: {
        dateTime: slot.start,
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: slot.end,
        timeZone: "America/Los_Angeles",
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    return NextResponse.json({
      success: true,
      link: response.data.htmlLink,
    });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
