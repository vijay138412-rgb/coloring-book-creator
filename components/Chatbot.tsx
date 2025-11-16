import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { ChatIcon, CloseIcon, SendIcon, UserIcon, CuteBotIcon } from './Icons';

interface ChatbotProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isTyping: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ messages, onSendMessage, isTyping }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`font-fredoka fixed bottom-6 right-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full p-4 shadow-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-transform transform hover:scale-110 ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open Chat"
      >
        <ChatIcon className="w-8 h-8" />
      </button>

      <div className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-full sm:w-[400px] sm:h-[calc(100%-4rem)] max-h-[600px] bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <header className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-2xl shadow-md">
          <div className="flex items-center gap-3">
            <CuteBotIcon className="w-7 h-7" />
            <h2 className="text-xl font-bold font-fredoka">Creative Helper</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && <div className="flex-shrink-0 bg-pink-200 p-2 rounded-full"><CuteBotIcon className="w-6 h-6 text-pink-600" /></div>}
              <div className={`w-auto max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                {msg.parts.map((part, i) => <p key={i} className="text-sm leading-relaxed">{part.text}</p>)}
              </div>
              {msg.role === 'user' && <div className="flex-shrink-0 bg-blue-200 p-2 rounded-full"><UserIcon className="w-6 h-6 text-blue-600" /></div>}
            </div>
          ))}
          {isTyping && (
             <div className="flex items-end gap-2.5">
               <div className="flex-shrink-0 bg-pink-200 p-2 rounded-full"><CuteBotIcon className="w-6 h-6 text-pink-600" /></div>
               <div className="max-w-[80%] p-3 rounded-2xl bg-white shadow-sm">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
                </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/30 flex items-center gap-2 bg-white/50">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask for ideas..."
            className="flex-1 p-3 border-gray-300 bg-white/80 border rounded-full focus:ring-2 focus:ring-pink-400 focus:outline-none transition-shadow focus:shadow-md"
            aria-label="Chat input"
          />
          <button type="submit" className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full p-3 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-300 disabled:to-pink-300 transition-all transform hover:scale-110" disabled={!inputValue.trim()} aria-label="Send message">
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;