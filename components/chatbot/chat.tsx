"use client";

import { ChangeEvent, useState, useEffect, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowUp, Info, SquarePen } from "lucide-react";
import { toast } from "sonner";

import ChatbotLoadingReply from "./chatbot-loading-reply";
import { Textarea } from "@/components/chatbot/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "../ui/alert";

interface Message {
  text: string;
  sender: "user" | "bot";
  url?: string;
  availableTimes?: [];
}

function formatResetTime(resetTimestampMs: number): string {
  const date = new Date(resetTimestampMs);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // hour 0 should be 12

  const minutesStr = minutes.toString().padStart(2, "0");
  return `${hours}:${minutesStr} ${ampm}`;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chatMessages = localStorage.getItem("chatMessages");
    setMessages(chatMessages ? JSON.parse(chatMessages) : []);
    setIsPageLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle the input change
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Trigger send on "Enter" key press
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);

    try {
      // Add user's message to chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: "user" },
      ]);

      // TODO: Temporarily store chat history in localStorage for demo purposes. Replace with backend storage later.
      const chatHistory = JSON.parse(
        localStorage.getItem("chatHistory") || "[]"
      );
      chatHistory.push({ role: "user", content: input });
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

      const response = await fetch("/api/openai", {
        method: "POST",
        body: JSON.stringify({ history: chatHistory }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 429) {
        const remaining = response.headers.get("X-RateLimit-Remaining");
        const reset = response.headers.get("X-RateLimit-Reset");
        // const data = await response.json();
        if (remaining !== null && reset !== null) {
          // const displayTime = formatResetTime(parseInt(reset));

          toast.error(`You've reached your limit. Try again in 8 hrs.`);
          setIsLoading(false);
          setInput("");
          return;
        }
      }

      const data = await response.json();

      // Push AI response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: data.reply,
          sender: "bot",
          url: data.url,
          availableTimes: data.availableTimes,
        },
      ]);

      // Also push assistant reply to chatHistory
      // TODO: Temporarily store chat history in localStorage for demo purposes. Replace with backend storage later.
      chatHistory.push({ role: "assistant", content: data.reply });
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

      setIsLoading(false);
    } catch (err) {
      console.error("Error sending message:", err);
      setIsLoading(false);
    }

    setInput("");
  };

  const handleResetChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="w-full mx-auto flex flex-1 flex-col">
      <ScrollArea className=" px-4 h-[calc(100vh-200px)] w-full m-0">
        <div className="max-w-3xl mx-auto ">
          {messages.length === 0 && !isPageLoading && (
            <div>
              <h1 className="font-bold text-2xl sm:text-3xl absolute bottom-20  left-1/2  transform -translate-x-1/2 whitespace-nowrap">
                What can I assist with?
              </h1>
              <Alert className="absolute bottom-4 w-fit  left-1/2  transform -translate-x-1/2 whitespace-nowrap ">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  You can send up to 20 messages every 8 hrs
                </AlertDescription>
              </Alert>
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              className={`flex py-5 px-6 ${
                msg.sender === "bot" ? "justify-start" : "justify-end"
              }`}
              key={index}
            >
              <div
                className={`py-2 px-4 rounded-t-3xl max-w-xs shadow-xs ${
                  msg.sender === "bot"
                    ? "bg-gray-200 text-gray-800 rounded-br-3xl"
                    : "bg-blue-500 text-white rounded-bl-3xl"
                }`}
              >
                {msg.url ? (
                  <Link
                    className="text-blue-500  hover:text-blue-600 font-bold"
                    href={msg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {msg.text}
                  </Link>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          {isLoading && <ChatbotLoadingReply />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="flex w-full flex justify-center ">
        <div
          className="bg-white flex max-w-3xl  space-x-2 p-3 rounded-3xl shadow-xs
        w-full mx-3"
        >
          <Textarea
            aria-label="Chat input"
            autoFocus
            className="flex-grow resize-none text-gray-800 max-w-3xl"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Book an appointment or inquire about services."
            rows={2}
            value={input}
          />

          <div
            className="flex flex-col gap-2
          "
          >
            <Button
              aria-label="Send message"
              className="bg-blue-500 w-8 h-8 p-0 sm:w-10 sm:h-10  rounded-full flex items-center justify-center cursor-pointer"
              onClick={handleSendMessage}
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
            <Button
              aria-label="Reset chat"
              className="bg-gray-500 w-8 h-8 p-0 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer"
              onClick={handleResetChat}
            >
              <SquarePen className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
