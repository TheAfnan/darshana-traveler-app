import { Bot, Compass, Loader2, MessageCircle, RefreshCw, Send, Shield, Sparkles, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { yatraShayakApi } from '../services/api';
import { getChatResponse } from '../services/geminiService';

interface YatraShayakProps {
  onSafetyClick?: () => void;
}

const QUICK_SUGGESTIONS = [
  "📍 Lucknow to Agra distance",
  "🛡️ Emergency Safety Tips",
  "🍲 Famous Indian Street Food",
  "🏰 Top Places to Visit"
];

const YatraShayak: React.FC<YatraShayakProps> = ({ onSafetyClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<{ type: 'user' | 'bot'; text: string; time: string }[]>([
    { 
      type: 'bot', 
      text: 'Namaste! 🙏 I am **Sarthi**, your AI travel companion powered by Google Gemini. How can I help with your Indian travel plans today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [history, isOpen, loading]);

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || message;
    if (!query.trim() || loading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHistory(prev => [...prev, { type: 'user', text: query, time: userTime }]);
    if (!textToSend) setMessage('');
    setLoading(true);

    try {
      // First try backend API
      const res = await yatraShayakApi.chat(query);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (res.success && res.data && (res.data as any).response) {
        const data = res.data as { response: string };
        setHistory(prev => [...prev, { type: 'bot', text: data.response, time: botTime }]);
        return;
      }
      
      // Fallback to Gemini AI service
      const reply = await getChatResponse(history, query);
      setHistory(prev => [...prev, { type: 'bot', text: reply, time: botTime }]);
    } catch (error) {
      console.warn("Backend chat unavailable, using Gemini AI service:", error);
      const reply = await getChatResponse(history, query);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setHistory(prev => [...prev, { type: 'bot', text: reply, time: botTime }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([
      { 
        type: 'bot', 
        text: 'Namaste! 🙏 Conversation reset. How can Sarthi assist you now?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
    ]);
  };

  // Render markdown bold, lists, and headers formatting nicely
  const renderFormattedMessage = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    
    return lines.map((line, lineIdx) => {
      if (!line.trim()) return <div key={lineIdx} className="h-1.5" />;

      const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
      let content = isBullet ? line.trim().replace(/^[\*\-]\s+/, '') : line;

      // Handle bold syntax **bold text**
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIdx} className="font-semibold text-amber-300 drop-shadow-xs">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-amber-400 font-bold text-xs mt-1">•</span>
            <span className="flex-1 leading-relaxed text-slate-100">{formattedParts}</span>
          </div>
        );
      }

      return (
        <p key={lineIdx} className="my-0.5 leading-relaxed text-slate-100">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 font-sans">
      {/* Floating Teaser pill when closed */}
      {!isOpen && (
        <div className="flex flex-col items-end animate-bounce-slow">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 py-2.5 px-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] mb-2 flex items-center gap-2.5 hover:border-amber-400 transition-all cursor-pointer"
               onClick={() => setIsOpen(true)}>
            <div className="relative">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block animate-ping absolute top-0 right-0"></span>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span>
            </div>
            <div>
              <p className="font-semibold text-xs text-amber-300 flex items-center gap-1">
                Ask Sarthi AI <Sparkles size={12} className="text-amber-400" />
              </p>
              <p className="text-[11px] text-slate-300">Live Routes, Food & Safety</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSafetyClick && (
              <button
                onClick={onSafetyClick}
                className="bg-gradient-to-r from-rose-600 to-red-500 text-white p-3.5 rounded-full shadow-[0_8px_20px_-4px_rgba(225,29,72,0.6)] hover:scale-105 transition-all group"
                title="Emergency SOS Dashboard"
              >
                <Shield className="w-5 h-5 animate-pulse" />
                <span className="absolute right-full mr-3 bg-slate-900/90 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-rose-500/30">
                  Emergency SOS
                </span>
              </button>
            )}

            <button
              onClick={() => setIsOpen(true)}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 p-4 rounded-full shadow-[0_10px_30px_-5px_rgba(245,158,11,0.6)] hover:scale-110 transition-all flex items-center justify-center relative group"
              aria-label="Open Sarthi AI Assistant"
            >
              <MessageCircle size={26} className="text-slate-950 fill-slate-950" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-slate-900"></span>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Expanded Chatbot Modal */}
      {isOpen && (
        <div className="w-80 sm:w-[380px] h-[540px] rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-amber-500/20 bg-slate-950/95 backdrop-blur-2xl flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-4 border-b border-amber-500/20 flex items-center justify-between shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-400 font-bold text-lg">
                    <Bot size={20} className="text-amber-400" />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-100 text-sm tracking-wide">SARTHI AI</h3>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    GEMINI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Compass size={11} className="text-amber-400" /> Yatra Sahayak • Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 relative z-10">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 transition-colors"
                title="Reset conversation"
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {history.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-1 text-amber-400">
                    <Bot size={14} />
                  </div>
                )}

                <div className={`group relative max-w-[84%] flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm shadow-lg ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-medium rounded-tr-xs'
                        : 'bg-slate-900/90 border border-slate-800/90 text-slate-200 rounded-tl-xs backdrop-blur-md'
                    }`}
                  >
                    {msg.type === 'user' ? (
                      <p className="leading-relaxed">{msg.text}</p>
                    ) : (
                      renderFormattedMessage(msg.text)
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>

                {msg.type === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0 mt-1 text-orange-400">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Loader */}
            {loading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Bot size={14} />
                </div>
                <div className="bg-slate-900/90 border border-slate-800/90 px-4 py-3 rounded-2xl rounded-tl-xs text-xs text-amber-300/90 flex items-center gap-2 shadow-md">
                  <Loader2 className="animate-spin text-amber-400" size={14} />
                  <span className="font-medium text-xs tracking-wide">Sarthi is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-900/80 flex overflow-x-auto gap-2 no-scrollbar">
            {QUICK_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => sendMessage(sug)}
                disabled={loading}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-[11px] text-slate-300 hover:text-amber-300 whitespace-nowrap transition-all shrink-0 hover:bg-slate-800/60"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 rounded-2xl px-3 py-1.5 focus-within:border-amber-500/60 focus-within:ring-1 focus-within:ring-amber-500/30 transition-all shadow-inner"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Sarthi about routes, food, safety..."
                className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none py-1.5"
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md"
                aria-label="Send message"
                title="Send"
              >
                <Send size={15} className="fill-slate-950" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default YatraShayak;
