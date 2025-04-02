export default function ChatbotLoadingReply() {
  return (
    <div className="flex space-x-1 py-2 px-4">
      <span className="w-3  h-3 bg-gray-500 rounded-full animate-bounce"></span>
      <span className="w-3 h-3  bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
      <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
    </div>
  );
}
