"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Send, MessageCircle } from "lucide-react";
import { ChatbotErrorHandler } from "./chatbot-error-handler";
import { RobotIcon } from "./robot-icon";
import { ChatSuggestion } from "./chat-suggestion";
import { QuickSuggestions } from "./quick-suggestions";

// Import custom CSS
import "@/styles/enhanced-chatbot.css";

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function RasaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Xin chào! Tôi là trợ lý ảo của Sun Movement. Tôi có thể giúp gì cho bạn?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".chat-button") // Don't close when clicking the button itself
      ) {
        setIsOpen(false);
      }
    };

    // Handle Escape key to close chat
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Check if the Rasa server is available
  const checkRasaAvailability = async () => {
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: "connection_test",
          message: "ping",
        }),
      });

      if (response.ok) {
        setConnectionError(false);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({
          error: "Unknown error",
        }));
        console.error("Connection test failed:", response.status, errorData);
        setConnectionError(true);
        return false;
      }
    } catch (error) {
      console.error("Error checking Rasa availability:", error);
      setConnectionError(true);
      return false;
    }
  };

  // Initialize and check connection when the component is mounted or opened
  useEffect(() => {
    if (isOpen) {
      checkRasaAvailability();
    }
  }, [isOpen]);

  // Send message to Rasa server via proxy API
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = {
      text: message,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Use our proxy API endpoint instead of direct Rasa connection
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: "user",
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        // Add bot responses to chat
        data.forEach((botResponse: any) => {
          const botMessage = {
            text: botResponse.text || "Tôi không hiểu. Vui lòng thử lại.",
            sender: "bot" as const,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
        });
      } else {
        // Handle empty response
        setMessages((prev) => [
          ...prev,
          {
            text: "Tôi không thể xử lý yêu cầu này. Vui lòng thử lại sau.",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }

      // Reset connection error state if successful
      setConnectionError(false);
    } catch (error) {
      console.error("Error connecting to Rasa server:", error);
      setConnectionError(true);
      setMessages((prev) => [
        ...prev,
        {
          text: "Không thể kết nối với trợ lý ảo. Vui lòng thử lại sau.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };
  // Handle retry when connection fails
  const handleRetry = async () => {
    setConnectionError(false);
    const isAvailable = await checkRasaAvailability();
    
    if (isAvailable) {
      setMessages([
        {
          text: "Kết nối thành công! Tôi là trợ lý ảo của Sun Movement. Tôi có thể giúp gì cho bạn?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Handle closing the chatbot
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Chatbot close button clicked'); // Debug log
    setIsOpen(false);
  };

  // Handle opening the chatbot
  const handleOpen = () => {
    console.log('Chatbot open button clicked'); // Debug log
    setIsOpen(true);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    const chatContainer = document.getElementById("chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  // Function to render message text with basic markdown support
  const renderMessageText = (text: string) => {
    // Simple markdown parsing for common formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic text
      .replace(/\n/g, "<br/>") // Line breaks
      .replace(/• /g, "• "); // Bullet points
  };

  return (
    <>
      {/* Floating button with suggestions - centered vertically on the right */}
      {!isOpen && (
        <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50">
          <ChatSuggestion isOpen={isOpen} />
          <Button
            onClick={handleOpen}
            className="text-white shadow-2xl rounded-full p-4 chat-button"
            size="lg"
            aria-label="Mở trợ lý ảo"
          >
            <RobotIcon showNotification={true} />
          </Button>
        </div>
      )}

      {/* Chat widget - centered vertically on the right */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 chatbot-widget chat-open"
        >
          {/* Header */}
          <div className="text-white p-4 rounded-t-lg flex justify-between items-center chatbot-header">
            <div className="flex items-center">
              <RobotIcon className="mr-2" />
              <h3 className="font-semibold">Sun Movement Trợ Lý Ảo</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="hover:bg-red-700 text-white h-8 w-8 p-0 chat-close-button"
              aria-label="Đóng hộp thoại"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content area */}
          {connectionError ? (
            <ChatbotErrorHandler onRetry={handleRetry} />
          ) : (
            <>
              {/* Quick suggestions */}
              {messages.length < 3 && <QuickSuggestions onSelect={sendMessage} />}

              {/* Messages area */}
              <div
                id="chat-messages"
                className="flex-1 p-4 overflow-y-auto space-y-4"
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <div className="user-message p-3">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: renderMessageText(message.text),
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0">
                          <RobotIcon className="scale-75" />
                        </div>
                        <div className="bot-message p-3">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: renderMessageText(message.text),
                            }}
                            className="whitespace-pre-line"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bot-message typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input area */}
              <form onSubmit={handleSubmit} className="chatbot-input">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 chatbot-input-field"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    className="send-button"
                    disabled={isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
