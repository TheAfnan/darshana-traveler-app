import { Bot, Compass, Loader2, MessageCircle, RefreshCw, Send, Shield, Sparkles, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { yatraShayakApi } from '../services/api';
import { getChatResponse } from '../services/geminiService';
import darshanaIcon from '../images/darshana-icon-only.webp';

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
  const location = useLocation();
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

  // If user is on the dedicated /assistant or /booking page, do not render floating widget to avoid overlap
  if (location.pathname === '/assistant' || location.pathname === '/booking') {
    return null;
  }

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || message;
    if (!query.trim() || loading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHistory(prev => [...prev, { type: 'user', text: query, time: userTime }]);
    if (!textToSend) setMessage('');
    setLoading(true);

    try {
      const res = await yatraShayakApi.chat(query);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (res.success && res.data && (res.data as any).response) {
        const data = res.data as { response: string };
        setHistory(prev => [...prev, { type: 'bot', text: data.response, time: botTime }]);
        return;
      }
      
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

  const renderFormattedMessage = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    
    return lines.map((line, lineIdx) => {
      if (!line.trim()) return <div key={lineIdx} className="h-1.5" />;

      const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
      let content = isBullet ? line.trim().replace(/^[\*\-]\s+/, '') : line;

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
      {/* Floating Teaser Pill ONLY when closed */}
      {!isOpen && (
        <div className="flex flex-col items-end animate-bounce-slow">
          <div 
            className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 py-2.5 px-4 rounded-2xl shadow-xl mb-2 flex items-center gap-2.5 hover:border-amber-400 transition-all cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
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
                className="bg-gradient-to-r from-rose-600 to-red-500 text-white p-3.5 rounded-full shadow-lg hover:scale-105 transition-all group cursor-pointer"
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
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 p-4 rounded-full shadow-xl hover:scale-110 transition-all flex items-center justify-center relative group cursor-pointer"
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

      {/* Main Sarthi Chat Modal */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[580px] bg-slate-950/95 backdrop-blur-2xl border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-md flex items-center justify-center">
                  <img src={darshanaIcon} alt="Sarthi" className="w-full h-full rounded-2xl object-cover" />
                </div>
                <span className="w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full absolute -bottom-0.5 -right-0.5"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-100 text-sm tracking-wide">SARTHI AI</h3>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                    GEMINI
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  Active Travel Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={handleClearHistory}
                className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-white/5 rounded-xl transition cursor-pointer"
                title="Reset conversation"
              >
                <RefreshCw size={15} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer"
                title="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick suggestions pills */}
          <div className="px-3 py-2 bg-slate-900/50 border-b border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(sug.replace(/^.+?\s/, ''))}
                className="text-[11px] bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-amber-200 px-2.5 py-1 rounded-full whitespace-nowrap transition shrink-0 cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
            {history.map((msg, index) => {
              const isUser = msg.type === 'user';
              return (
                <div key={index} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                      <img src={darshanaIcon} alt="Sarthi" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-slate-300">
                      <User size={14} />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                    isUser 
                      ? 'bg-amber-600 text-white rounded-tr-none' 
                      : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
                  }`}>
                    {isUser ? <p className="leading-relaxed">{msg.text}</p> : renderFormattedMessage(msg.text)}
                    <span className={`text-[9px] block mt-1.5 opacity-60 ${isUser ? 'text-right text-amber-100' : 'text-left text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-600 flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={darshanaIcon} alt="Sarthi" className="w-full h-full object-cover" />
                </div>
                <div className="bg-slate-900 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-amber-300 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-amber-400" />
                  <span className="font-medium text-xs">Sarthi is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sticky Input Bar */}
          <div className="p-3 bg-slate-900/90 border-t border-white/10">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Sarthi about routes, food, safety..."
                className="flex-1 bg-slate-950 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition shadow-sm cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default YatraShayak;
