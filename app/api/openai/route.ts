import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request, res: Response) {
  try {
    const { message } = await req.json();

    const aiResp = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });

    let botReply =
      aiResp.choices[0]?.message.content || `Sorry, I didn't get that.`;

    // If user asks to book an appointment, call Calendly API

    return NextResponse.json({ reply: botReply });
  } catch (err) {
    console.error("Error receiving response from OpenAI or Calendly API:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
