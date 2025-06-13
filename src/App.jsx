import { useState, useRef, useEffect } from "react";
import ChatInputBox from "./Components/ChatInputBox";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export default function App() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (msg) => {
    setMessages((prev) => [...prev, { role: "user", text: msg }]);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: msg }],
            },
          ],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const botMessage =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response.";

      setMessages((prev) => [...prev, { role: "bot", text: botMessage }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error: Failed to fetch response." },
      ]);
      console.error("API Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Scrollable messages */}
      <div className="pb-28 px-4 pt-4 overflow-y-auto h-full">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-xl px-4 py-2 rounded-2xl shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-white text-gray-800 self-start mr-auto border"
              }`}
            >
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed input box */}
      <div className="absolute bottom-0 left-0 w-full px-4 py-3 bg-gray-100 border-t">
        <ChatInputBox onSend={handleSend} />
      </div>
    </div>
  );
}
