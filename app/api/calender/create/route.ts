import { google } from "googleapis";
import path from "path";
import { NextResponse } from "next/server";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const calendarId = process.env.GOOGLE_CALENDER_ID;

export async function POST() {
  try {
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
      summary: "Appointment Booked! 🎉",
      description: "Demo appointment booking",
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
