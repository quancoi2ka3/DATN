"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Send, MessageCircle } from "lucide-react";
import { ChatbotErrorHandler } from "./chatbot-error-handler";

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
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
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
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text  
      .replace(/\n/g, '<br/>') // Line breaks
      .replace(/• /g, '• '); // Bullet points
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white shadow-2xl rounded-full p-4 animate-pulse hover:animate-none"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Sun Movement Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 text-white h-8 w-8 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content area */}
          {connectionError ? (
            <ChatbotErrorHandler onRetry={handleRetry} />
          ) : (
            <>
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
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: renderMessageText(message.text) 
                        }}
                        className={message.sender === "bot" ? "whitespace-pre-line" : ""}
                      />
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-gray-100">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input area */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 rounded-l-none"
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
