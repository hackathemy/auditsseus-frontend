"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Image as ImageIcon, ExternalLink } from "lucide-react";

// API 엔드포인트 환경 변수 사용
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface MessageResponse {
  user: string;
  text: string;
  action: string;
}

interface Message {
  text: string;
  isUser: boolean;
  action?: string;
}

interface ChatProps {
  onImageUploadClick: () => void;
}

export function Chat({ onImageUploadClick }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/Sseus/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();
      
      // API 응답 처리
      if (Array.isArray(data) && data.length > 0) {
        const messageResponse = data[0] as MessageResponse;
        setMessages(prev => [...prev, { 
          text: messageResponse.text, 
          isUser: false,
          action: messageResponse.action 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          text: data.response || "Error occurred", 
          isUser: false 
        }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { text: "Error: Could not get response", isUser: false }]);
    } finally {
      setIsLoading(false);
      
      // 스크롤을 항상 맨 아래로 이동
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  // Action에 따른 렌더링 처리
  const renderMessageContent = (message: Message) => {
    if (!message.isUser && message.action) {
      switch (message.action) {
        case "LINK":
          return (
            <div>
              <div className="mb-2">{message.text}</div>
              <a 
                href="#" 
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 underline text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" /> 자세히 보기
              </a>
            </div>
          );
        case "IMAGE":
          return (
            <div>
              <div className="mb-2">{message.text}</div>
              <div className="mt-2 bg-slate-800 rounded-lg p-2 border border-slate-600">
                <div className="text-xs text-slate-400 mb-1">이미지 분석 결과</div>
                <div className="w-full h-40 bg-slate-900 rounded flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-slate-600" />
                </div>
              </div>
            </div>
          );
        case "CODE":
          return (
            <div>
              <div className="mb-2">{message.text}</div>
              <div className="mt-2 bg-slate-900 rounded-lg p-2 border border-slate-700 font-mono text-sm text-green-400 overflow-x-auto">
                {`// 예시 코드
function analyze() {
  return "이미지 분석 결과";
}`}
              </div>
            </div>
          );
        case "ALERT":
          return (
            <div>
              <div className="mb-2">{message.text}</div>
              <div className="mt-2 bg-red-900/30 text-red-300 border border-red-800 rounded-lg p-3 text-sm">
                ⚠️ 주의: 잠재적인 IP 침해 가능성이 감지되었습니다.
              </div>
            </div>
          );
        case "NONE":
        default:
          return message.text;
      }
    }
    
    return message.text;
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700 shadow-xl">
      <div className="bg-gradient-to-r from-blue-500/10 to-emerald-400/10 p-4 border-b border-slate-700 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-slate-100">Auditsseus AI</h3>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4 opacity-80">
              <div className="w-16 h-16 rounded-full bg-blue-900/40 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-200 mb-2">Welcome to Auditsseus</h3>
                <p className="text-slate-400 max-w-md">
                  Ask me anything about image auditing or upload an image to analyze for potential IP infringement.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-blue-900 flex-shrink-0 flex items-center justify-center mr-3">
                    <span className="text-blue-400 text-xs font-bold">AI</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    message.isUser
                      ? "bg-blue-600 text-white border border-blue-500 shadow-md"
                      : "bg-slate-700 text-slate-100 border border-slate-600 shadow-md"
                  }`}
                >
                  {renderMessageContent(message)}
                </div>
                {message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center ml-3">
                    <span className="text-slate-300 text-xs font-bold">You</span>
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-900 flex-shrink-0 flex items-center justify-center mr-3">
                <span className="text-blue-400 text-xs font-bold">AI</span>
              </div>
              <div className="bg-slate-700 text-slate-100 rounded-2xl px-5 py-3 border border-slate-600 shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-slate-700 space-y-4">
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            className="rounded-full h-10 w-10 text-slate-400 border-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-500"
            onClick={onImageUploadClick}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          
          <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-700 border-slate-600 focus:border-blue-500 text-slate-100 rounded-full"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="rounded-full bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 