import { google } from "googleapis";
import path from "path";
import { NextResponse } from "next/server";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const calendarId = process.env.GOOGLE_CALENDAR_ID;

export async function POST(req: Request) {
  try {
    const { name, email, slot } = await req.json();
    const keyFilePath = path.join(
      process.cwd(),
      process.env.GOOGLE_SERVICE_ACCOUNT_PATH
    );

    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: "v3", auth });

    const event = {
      summary: `Appointment with ${name}`,
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
