import { NextResponse } from "next/server";
import OpenAI from "openai";

import config from "@/config";
import { FaqSystemPrompt } from "@/lib/faq";
import { ratelimit } from "@/lib/rate-limiter";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (config.useRateLimiting) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("client-ip") ||
      "anonymous";
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }
  }

  let botReply = "";
  let url: string | undefined | null;

  try {
    const { history } = await req.json();
    const chatHistory: Message[] = [...history];

    if (config.useMockApi) {
      botReply = "MED ASSIST BOOK AN APPOINTMENT"; // mock response
    } else {
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

      botReply =
        aiResp.choices[0]?.message.content || `Sorry, I didn't get that.`;
    }

    if (
      botReply.trim() === "MED ASSIST BOOK AN APPOINTMENT" ||
      botReply.trim() === "Click here to book your appointment"
    ) {
      botReply = "Click here to book your appointment";
      url = "/demo/booking";
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
