import { NextResponse } from "next/server";
import OpenAI from "openai";

import { handleCalendlyBooking } from "@/lib/calendly/utils";
import { FaqSystemPrompt } from "@/lib/faq";
import {
  createGoogleCalenderEvent,
  findEarliestAvailability,
} from "@/lib/google/utils";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const IS_TEST = true;
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
      botReply = "MED ASSIST BOOK AN APPOINTMENT";
    }

    // If user asks to book an appointment, call Calendly API
    // if (botReply.trim() === "MED ASSIST BOOK AN APPOINTMENT") {
    //   const schedulingLink = await handleCalendlyBooking();

    //   console.log({ schedulingLink });

    //   botReply = "Click here to book your appointment";
    //   url = schedulingLink;
    // }

    // If user asks to book an appointment, call Google Calender API
    if (botReply.trim() === "MED ASSIST BOOK AN APPOINTMENT") {
      // 1) check earliest time and date available on calender
      // 1) ask user time and date
      // 1) update chatHistory

      const earliest = await findEarliestAvailability({});

      console.log(earliest);

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
