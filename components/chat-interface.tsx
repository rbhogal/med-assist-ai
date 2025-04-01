"use client";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ChangeEvent, useState, useEffect, useRef } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, ArrowUp, Send } from "lucide-react";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle the input change
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    console.log(input);
    if (!input.trim()) return;

    // Add user's message to chat history
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, sender: "user" },
    ]);

    // Placeholder for bot's response (this could be integrated with an API)
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "This is a bot reply", sender: "bot" },
      ]);
    }, 1000);

    setInput("");
  };

  // Trigger send on "Enter" key press
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      handleSendMessage();
    }
  };

  return (
    <div className=" max-w-3xl mx-auto my-10 bg-white rounded-3xl  ">
      {/* <Card>
        <CardHeader>
          <CardTitle>MedAssist</CardTitle>
          <CardDescription>Your care, simplified.</CardDescription>
        </CardHeader> */}
      <div className="p-4 space-y-4">
        <div className="space-y-2 h-96 overflow-y-auto px-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`py-2 px-4 rounded-t-3xl max-w-xs ${
                  msg.sender === "bot"
                    ? "bg-gray-100 text-gray-800 rounded-br-3xl"
                    : "bg-blue-500 text-white rounded-bl-3xl"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Book, reschedule, or inquire about services."
            rows={1}
            className="flex-grow resize-none text-gray-800 "
            onKeyDown={handleKeyDown}
          />

          <Button
            onClick={handleSendMessage}
            className="bg-blue-500 w-10 h-10 p-0 rounded-full flex items-center justify-center cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
      {/* </Card> */}
    </div>
  );

  // return (
  //   <div className=" max-w-3xl mx-auto my-10 bg-white rounded-3xl shadow-lg  ">
  //     <Card>
  //       <CardHeader>
  //         <CardTitle>MedAssist</CardTitle>
  //         <CardDescription>Your care, simplified.</CardDescription>
  //       </CardHeader>
  //       <div className="p-4 space-y-4">
  //         <div className="space-y-2 h-96 overflow-y-auto px-2">
  //           {messages.map((msg, index) => (
  //             <div
  //               key={index}
  //               className={`flex ${
  //                 msg.sender === "bot" ? "justify-start" : "justify-end"
  //               }`}
  //             >
  //               <div
  //                 className={`py-2 px-4 rounded-t-3xl max-w-xs ${
  //                   msg.sender === "bot"
  //                     ? "bg-gray-100 text-gray-800 rounded-br-3xl"
  //                     : "bg-blue-500 text-white rounded-bl-3xl"
  //                 }`}
  //               >
  //                 {msg.text}
  //               </div>
  //             </div>
  //           ))}
  //           <div ref={messagesEndRef} />
  //         </div>

  //         <div className="flex space-x-2">
  //           <Textarea
  //             value={input}
  //             onChange={handleInputChange}
  //             placeholder="Book, reschedule, or inquire about services."
  //             rows={1}
  //             className="flex-grow resize-none text-gray-800 "
  //             onKeyDown={handleKeyDown}
  //           />

  //           <Button
  //             onClick={handleSendMessage}
  //             className="bg-blue-500 w-10 h-10 p-0 rounded-full flex items-center justify-center cursor-pointer"
  //           >
  //             <ArrowUp className="w-5 h-5" />
  //           </Button>
  //         </div>
  //       </div>
  //     </Card>
  //   </div>
  // );
};

export default ChatInterface;
