import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CALENDLY_API_URL = "https://api.calendly.com/scheduled_events";
const CALENDLY_ACCESS_TOKEN = process.env.CALENDLY_ACCESS_TOKEN;
const CALENDLY_OAUTH_URL = "https://auth.calendly.com/oauth/authorize";
const CALENDLY_REDIRECT_URI = process.env.CALENDLY_REDIRECT_URI;
const CALENDLY_CLIENT_ID = process.env.CALENDLY_CLIENT_ID;

const checkUserCalendlyAuth = async (userId: string) => {
  // placeholder func
  return false;
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const aiResp = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a friendly and helpful medical assistant at a primary care clinic. Analyze the user's message and determine if they are asking to book an appointment. Reply with 'MED ASSIST BOOK AN APPOINTMENT' otherwise reply normally`,
        },
        { role: "user", content: message },
      ],
    });

    let botReply =
      aiResp.choices[0]?.message.content || `Sorry, I didn't get that.`;
    let url = undefined;

    // If user asks to book an appointment, call Calendly API
    if (botReply.includes("MED ASSIST BOOK AN APPOINTMENT")) {
      const isAuth = await checkUserCalendlyAuth("userId");

      if (!isAuth) {
        // redirect them to the Calendly sign-in page

        botReply = `Please sign in to Calendly:`;
        url = `${CALENDLY_OAUTH_URL}?client_id=${CALENDLY_CLIENT_ID}&response_type=code&redirect_uri=${CALENDLY_REDIRECT_URI}`;
      } else {
        // book appointment
      }
    }
    return NextResponse.json({
      reply: botReply,
      url: url,
    });
  } catch (err) {
    console.error("Error receiving response from OpenAI or Calendly API:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
