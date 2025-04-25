import { NextResponse } from "next/server";
import OpenAI from "openai";

import { FaqSystemPrompt } from "@/lib/faq";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const IS_TEST = false;
  let botReply = "";
  let url: string | undefined | null;

  try {
    const { history } = await req.json();
    const chatHistory: Message[] = [...history];

    if (!IS_TEST) {
      const aiResp = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: FaqSystemPrompt },
          {
            role: "system",
            content: `You are a friendly and helpful medical assistant at a primary care clinic. If a user isn't asking questions relevant to a primary care clinic, don't answer but instead gently remind them to answer questions regarding a primary care clinic. You can reply to general greetings however. Analyze the user's message and determine if they are asking to book an appointment. Reply with 'MED ASSIST BOOK AN APPOINTMENT' otherwise reply normally.`,
          },
          ...chatHistory,
        ],
      });

      console.log({ ai: aiResp.choices[0]?.message.content });
      botReply =
        aiResp.choices[0]?.message.content || `Sorry, I didn't get that.`;
    } else {
      console.log("med book");
      botReply = "MED ASSIST BOOK AN APPOINTMENT";
    }

    // If user asks to book an appointment, send to scheduler
    console.log({ botReply });
    if (
      botReply.trim() === "MED ASSIST BOOK AN APPOINTMENT" ||
      botReply.trim() === "Click here to book your appointment"
    ) {
      console.log("booking");
      botReply = "Click here to book your appointment";
      url = "/demo/booking";
      // 1) check e
      // const { success, link, error } = await createGoogleCalenderEvent();
      // if (success) {
      //   botReply = "Your appointment has been booked!";
      //   url = link;
      // } else {
      //   botReply = "Oops, something went wrong while booking your appointment.";
      // }
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
