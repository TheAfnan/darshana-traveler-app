import { onAuthStateChanged, type User } from 'firebase/auth';
import { 
  AlertCircle, 
  Bot, 
  Compass, 
  Heart, 
  Languages, 
  MapPin, 
  MessageSquare, 
  Mic, 
  Send, 
  Shield, 
  ThumbsDown, 
  ThumbsUp, 
  Sparkles,
  Globe,
  Key,
  CheckCircle2,
  X,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ASSISTANT_QA } from '../data/assistantQA';
import { auth } from '../firebase.config';
import { fetchQuestionsFromDB, saveChatToDB, saveFeedback } from '../services/databaseService';
import { getApiKey, getChatResponse, setCustomApiKey, translateText } from '../services/geminiService';
import darshanaIcon from '../images/darshana-icon-only.png';

interface Message {
  id: number;
  role: 'user' | 'model';
  text: string;
  translatedText?: string;
  isTranslating?: boolean;
  liked?: boolean;
  disliked?: boolean;
  mapLocation?: string;
}

interface QuickCategory {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  questions: string[];
}

const Assistant: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 0, 
      role: 'model', 
      text: i18n.language === 'hi'
        ? 'नमस्ते! मैं सारथी हूँ, आपका AI यात्रा साथी। 🙏\n\nभारत के पर्यटन स्थलों, यात्रा मार्गों, खान-पान या सुरक्षा के बारे में कुछ भी पूछें!'
        : 'Namaste! I am Sarthi, your AI travel companion. 🙏\n\nAsk me anything about traveling across India, cultural destinations, safety, local food, or itineraries!' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [listening, setListening] = useState(false);
  
  // API Key Modal State
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey());
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Quick Translator Box State
  const [showTranslatorBox, setShowTranslatorBox] = useState(false);
  const [transSourceText, setTransSourceText] = useState('');
  const [transResultText, setTransResultText] = useState('');
  const [isTranslatingBox, setIsTranslatingBox] = useState(false);
  const [copied, setCopied] = useState(false);

  const categories: QuickCategory[] = [
    {
      id: 'itinerary',
      label: i18n.language === 'hi' ? 'यात्रा योजना' : 'Yatrika (Itinerary)',
      icon: Compass,
      questions: [
        i18n.language === 'hi' ? 'उत्तर भारत का 7 दिवसीय यात्रा प्लान' : 'Plan a 7-day North India itinerary',
        i18n.language === 'hi' ? 'राजस्थान घूमने का सर्वोत्तम समय' : 'Best time to visit Rajasthan?',
        i18n.language === 'hi' ? 'कम बजट में 5 दिन का टूर' : 'Budget itinerary for 5 days'
      ]
    },
    {
      id: 'safety',
      label: i18n.language === 'hi' ? 'सुरक्षा एवं टिप्स' : 'Safety & Security',
      icon: Shield,
      questions: [
        i18n.language === 'hi' ? 'अकेले यात्रा करने वालों के लिए सुरक्षा टिप्स' : 'Safety tips for solo travelers',
        i18n.language === 'hi' ? 'आपातकालीन सावधानियां' : 'Emergency precautions in India'
      ]
    },
    {
      id: 'emergency',
      label: i18n.language === 'hi' ? 'हेल्पलाइन नंबर' : 'Emergency Numbers',
      icon: AlertCircle,
      questions: [
        i18n.language === 'hi' ? 'भारत में आपातकालीन नंबर' : 'Emergency helpline numbers in India',
        i18n.language === 'hi' ? 'पर्यटक सहायता नंबर' : 'Tourist helpline numbers'
      ]
    },
    {
      id: 'culture',
      label: i18n.language === 'hi' ? 'संस्कृति व खानपान' : 'Culture & Language',
      icon: Languages,
      questions: [
        i18n.language === 'hi' ? 'भारत के प्रमुख सांस्कृतिक त्योहार' : 'Major cultural festivals in India',
        i18n.language === 'hi' ? 'प्रसिद्ध भारतीय व्यंजन व स्ट्रीट फूड' : 'Famous Indian street food & cuisines'
      ]
    },
    {
      id: 'experience',
      label: i18n.language === 'hi' ? 'रोमांचक अनुभव' : 'Experiences',
      icon: Heart,
      questions: [
        i18n.language === 'hi' ? 'भारत के शीर्ष 10 दर्शनीय स्थल' : 'Top 10 must-visit destinations in India',
        i18n.language === 'hi' ? 'सांस्कृतिक धरोहर यात्रा' : 'Best heritage & cultural experiences'
      ]
    },
    {
      id: 'practical',
      label: i18n.language === 'hi' ? 'व्यावहारिक जानकारी' : 'Practical Info',
      icon: MessageSquare,
      questions: [
        i18n.language === 'hi' ? 'ट्रेन और फ्लाइट बुकिंग के तरीके' : 'Train vs Bus vs Flight travel in India',
        i18n.language === 'hi' ? 'भुगतान और मुद्रा संबंधी जानकारी' : 'Currency & digital payment methods (UPI)'
      ]
    }
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Send Message
  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (user) {
        await saveChatToDB(user.uid, userMessage);
      }

      const activeLang = (i18n.language === 'hi' ? 'hi' : 'en') as 'en' | 'hi';
      const reply = await getChatResponse(
        messages.map((m) => ({ text: m.text, role: m.role })),
        textToSend,
        activeLang
      );

      const botMessage: Message = {
        id: Date.now() + 1,
        role: 'model',
        text: reply
      };

      setMessages((prev) => [...prev, botMessage]);

      if (user) {
        await saveChatToDB(user.uid, botMessage);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'model',
          text: i18n.language === 'hi'
            ? 'क्षमा करें, कनेक्शन में समस्या आ रही है। कृपया पुनः प्रयास करें।'
            : 'I apologize, but I am having trouble connecting. Please check your API key or connection.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Language Handler
  const handleLanguageToggle = () => {
    const newLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  // In-Chat Translation Handler
  const handleTranslateMessage = async (msgId: number, currentText: string) => {
    const targetLang = i18n.language === 'hi' ? 'English' : 'Hindi';
    
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isTranslating: true } : m));

    try {
      const translated = await translateText(currentText, targetLang);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, translatedText: translated, isTranslating: false } : m));
    } catch (err) {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isTranslating: false } : m));
    }
  };

  // Quick Translator Box Handler
  const handleQuickTranslate = async () => {
    if (!transSourceText.trim()) return;
    setIsTranslatingBox(true);
    try {
      const targetLang = i18n.language === 'hi' ? 'English' : 'Hindi';
      const res = await translateText(transSourceText, targetLang);
      setTransResultText(res);
    } finally {
      setIsTranslatingBox(false);
    }
  };

  // Save API Key Handler
  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomApiKey(apiKeyInput);
    setApiKeySaved(true);
    setTimeout(() => {
      setApiKeySaved(false);
      setShowApiModal(false);
    }, 1500);
  };

  const handleFeedback = async (id: number, feedback: 'like' | 'dislike') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              liked: feedback === 'like',
              disliked: feedback === 'dislike'
            }
          : msg
      )
    );

    if (user) {
      await saveFeedback(user.uid, id, feedback);
    }
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;

    if (!listening) {
      recognition.start();
      setListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  const hasApiKey = Boolean(getApiKey());

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 min-h-[calc(100vh-90px)] flex flex-col font-sans">
      
      {/* API Key Configuration Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Key size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Google Gemini API Setup</h3>
              </div>
              <button onClick={() => setShowApiModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your personal Google Gemini API key for fast, high-limit AI travel planning and real-time multi-language translation.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gemini API Key (starts with AIzaSy...)</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste your Gemini API key..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="text-[11px] text-slate-500">
                <span>Free key link: </span>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-amber-700 font-semibold underline">
                  Google AI Studio (Get Free Key)
                </a>
              </div>

              {apiKeySaved && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={15} />
                  <span>API Key saved & active!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setApiKeyInput('');
                    setCustomApiKey('');
                    setApiKeySaved(true);
                    setTimeout(() => { setApiKeySaved(false); setShowApiModal(false); }, 1000);
                  }}
                  className="px-3.5 py-2 border border-stone-200 text-xs font-semibold text-slate-600 rounded-xl hover:bg-stone-50"
                >
                  Reset Default
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
                >
                  Save API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Chat Container */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
        
        {/* Header with DarShana Brand Mark, API Setup, and Working Language Translator */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 px-4 sm:px-6 py-4 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 p-0.5 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <img src={darshanaIcon} alt="Sarthi" className="w-full h-full rounded-2xl object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg text-white">Sarthi AI</h2>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  GEMINI 1.5
                </span>
              </div>
              <p className="text-xs text-emerald-200">Bilingual Cultural Travel Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Live Translator Tool Button */}
            <button
              onClick={() => setShowTranslatorBox(!showTranslatorBox)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                showTranslatorBox ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
              }`}
              title="Open Language Translator Box"
            >
              <Languages size={13} />
              <span className="hidden sm:inline">Translator</span>
            </button>

            {/* API Setup Button */}
            <button
              onClick={() => setShowApiModal(true)}
              className="px-3 py-1.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-full text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Configure API Key"
            >
              <Key size={13} className={hasApiKey ? 'text-emerald-400' : 'text-amber-300'} />
              <span className="hidden sm:inline">API Setup</span>
              <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            </button>

            {/* Language Toggle Button (हिन्दी / English) */}
            <button
              onClick={handleLanguageToggle}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Toggle App & Assistant Language"
            >
              <Globe size={13} className="text-slate-950" />
              <span>{i18n.language === 'hi' ? 'हिन्दी (Hindi)' : 'English'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Translator Quick Tray (if opened) */}
        {showTranslatorBox && (
          <div className="bg-amber-50/90 border-b border-amber-200 px-4 sm:px-6 py-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Languages size={14} className="text-amber-700" />
                <span>Instant Travel Language Translator ({i18n.language === 'hi' ? 'Hindi ➔ English' : 'English ➔ Hindi'})</span>
              </span>
              <button onClick={() => setShowTranslatorBox(false)} className="text-amber-800 hover:text-amber-950">
                <X size={15} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={transSourceText}
                onChange={(e) => setTransSourceText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickTranslate()}
                placeholder="Type word or travel phrase to translate (e.g. How much is the ticket?)..."
                className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-600"
              />
              <button
                onClick={handleQuickTranslate}
                disabled={isTranslatingBox || !transSourceText.trim()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition cursor-pointer shrink-0 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isTranslatingBox ? <RefreshCw size={13} className="animate-spin" /> : <Languages size={13} />}
                <span>Translate</span>
              </button>
            </div>

            {transResultText && (
              <div className="p-2.5 bg-white border border-amber-200 rounded-xl flex items-center justify-between text-slate-900 font-medium">
                <span className="text-xs">{transResultText}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(transResultText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-1 text-slate-500 hover:text-amber-700 transition"
                  title="Copy translation"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-[#faf9f6]">
          {messages.map((msg) => {
            const isAi = msg.role === 'model';
            return (
              <div key={msg.id} className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? 'bg-white text-slate-800 border border-stone-200 rounded-tl-none shadow-xs'
                      : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-tr-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {/* Translated Text In-Bubble Display */}
                  {msg.translatedText && (
                    <div className="mt-2.5 pt-2 border-t border-stone-200/80 bg-amber-50/60 p-2.5 rounded-xl text-xs text-amber-950 font-medium">
                      <span className="text-[10px] uppercase font-bold text-amber-700 block mb-0.5">Translation:</span>
                      {msg.translatedText}
                    </div>
                  )}

                  {msg.mapLocation && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-orange-600 font-semibold text-xs">
                      <MapPin size={14} />
                      <span>{msg.mapLocation}</span>
                    </div>
                  )}

                  {/* Actions: Translate Button + Feedback (AI only) */}
                  {isAi && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      {/* 1-Click Translation Action */}
                      <button
                        onClick={() => handleTranslateMessage(msg.id, msg.text)}
                        disabled={msg.isTranslating}
                        className="text-stone-500 hover:text-amber-800 font-semibold flex items-center gap-1 text-[11px] hover:bg-stone-50 px-2 py-1 rounded-md transition cursor-pointer"
                        title="Translate this response"
                      >
                        <Languages size={12} className={msg.isTranslating ? 'animate-spin text-amber-600' : 'text-amber-600'} />
                        <span>{msg.isTranslating ? 'Translating...' : (i18n.language === 'hi' ? 'Translate to English' : 'Translate to हिन्दी')}</span>
                      </button>

                      {/* Feedback Buttons (Only for non-greeting AI messages) */}
                      {msg.id !== 0 && (
                        <div className="flex items-center gap-2">
                          <button
                            aria-label="Helpful"
                            onClick={() => handleFeedback(msg.id, 'like')}
                            className={`p-1 rounded-md transition cursor-pointer ${
                              msg.liked ? 'text-orange-600 bg-orange-50' : 'text-stone-400 hover:text-stone-700'
                            }`}
                          >
                            <ThumbsUp size={13} />
                          </button>
                          <button
                            aria-label="Not helpful"
                            onClick={() => handleFeedback(msg.id, 'dislike')}
                            className={`p-1 rounded-md transition cursor-pointer ${
                              msg.disliked ? 'text-stone-700 bg-stone-100' : 'text-stone-400 hover:text-stone-700'
                            }`}
                          >
                            <ThumbsDown size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-stone-200 shadow-xs flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-150"></span>
                <span className="ml-1 text-slate-600 font-medium">Sarthi is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Compact Quick Suggestions */}
        {messages.length < 5 && (
          <div className="px-4 py-3 bg-white border-t border-stone-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {i18n.language === 'hi' ? 'त्वरित सुझाव' : 'Quick Suggestions'}
            </span>
            
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                const iconColor = idx % 2 === 0 ? 'text-orange-600' : 'text-emerald-700';
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSend(cat.questions[0])}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-orange-300 text-xs font-semibold text-slate-800 transition shrink-0 cursor-pointer shadow-2xs group"
                  >
                    <Icon size={15} className={`${iconColor} group-hover:scale-110 transition-transform shrink-0`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sticky Input Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200 sticky bottom-0 z-10">
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2 focus-within:border-orange-500 focus-within:bg-white transition">
            <button
              onClick={toggleListening}
              className={`p-2 rounded-xl transition cursor-pointer ${
                listening ? 'bg-orange-600 text-white' : 'bg-stone-200 text-slate-600 hover:bg-stone-300'
              }`}
              aria-label={listening ? 'Stop listening' : 'Start listening'}
              title="Voice Input"
            >
              <Mic size={17} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={i18n.language === 'hi' ? 'सारथी से पर्यटन, खानपान या सुरक्षा के बारे में पूछें...' : 'Ask Sarthi about routes, monuments, culture, safety...'}
              className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 placeholder-stone-400 text-xs sm:text-sm"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl disabled:opacity-40 transition shadow-sm cursor-pointer"
              title="Send Message"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Assistant;