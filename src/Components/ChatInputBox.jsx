import { useState } from "react";
import { SendHorizonal } from "lucide-react";

export default function ChatInputBox({ onSend }) {
  const [message, setMessage] = useState("");
   
  const handleSend = () => {
    if (!message.trim()) return;
    onSend?.(message);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-3 bg-white border border-gray-300 rounded-2xl shadow-sm flex items-center space-x-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        rows={1}
        placeholder="Send a message..."
        className="flex-grow resize-none outline-none border-none bg-transparent text-base text-gray-800 placeholder-gray-400"
      />
      <button
        onClick={handleSend}
        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition"
      >
        <SendHorizonal size={18} />
      </button>
    </div>
  );
}
