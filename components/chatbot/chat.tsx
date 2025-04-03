"use client";
import { ChangeEvent, useState, useEffect, useRef, KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";

import { Textarea } from "@/components/chatbot/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatbotLoadingReply from "./chatbot-loading-reply";

interface Message {
  text: string;
  sender: "user" | "bot";
  url?: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

    // Add user's message to chat history
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, sender: "user" },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        body: JSON.stringify({ message: input }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      // Push AI response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.reply, sender: "bot", url: data.url },
      ]);
      setIsLoading(false);
    } catch (err) {
      console.error("Error sending message:", err);
      setIsLoading(false);
    }

    setInput("");
  };
  console.log(messages);
  return (
    <div className="w-full mx-auto flex flex-1 flex-col">
      <ScrollArea className=" px-4 h-[calc(100vh-200px)] w-full m-0">
        <div className="max-w-3xl mx-auto ">
          {messages.length === 0 && (
            <h1 className="font-bold text-2xl sm:text-3xl py-12 absolute bottom-0 left-1/2  transform -translate-x-1/2">
              What can I assist with?
            </h1>
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
                  <>
                    {msg.text}
                    <a href={msg.url} target="_blank" rel="noopener noreferrer">
                      Calendly Sign In
                    </a>
                  </>
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
            placeholder="Book, reschedule, or inquire about services."
            rows={2}
            value={input}
          />

          <Button
            aria-label="Send message"
            className="bg-blue-500 w-8 h-8 p-0 sm:w-10 sm:h-10  rounded-full flex items-center justify-center cursor-pointer"
            onClick={handleSendMessage}
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
