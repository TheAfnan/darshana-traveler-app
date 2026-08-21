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
  ChevronRight
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ASSISTANT_QA } from '../data/assistantQA';
import { auth } from '../firebase.config';
import { fetchQuestionsFromDB, saveChatToDB, saveFeedback } from '../services/databaseService';
import { getChatResponse } from '../services/geminiService';
import darshanaIcon from '../images/darshana-icon-only.png';

interface Message {
  id: number;
  role: 'user' | 'model';
  text: string;
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

interface KnowledgeBaseEntry {
  _id?: string;
  category?: string;
  categoryLabel?: string;
  question: string;
  questionHi?: string;
  answer: string;
  answerHi?: string;
  tags?: string[];
}

interface StaticKnowledgeEntry {
  id: string;
  variants: string[];
  answer: string;
}

const STATIC_KNOWLEDGE_BASE: StaticKnowledgeEntry[] = [
  {
    id: 'greeting',
    variants: ['hello', 'hi', 'hey', 'namaste', 'greetings'],
    answer: 'Namaste! I am Sarthi, your personal travel assistant. How can I help you plan your journey today?'
  },
  {
    id: 'identity',
    variants: ['who are you', 'what is your name', 'what do you do'],
    answer: 'I am Sarthi, an AI-powered travel assistant designed to help you explore India, find festivals, ensure safety, and plan your trips.'
  },
  {
    id: 'booking',
    variants: ['how to book a trip', 'booking', 'book ticket', 'reservation'],
    answer: "To book a trip, navigate to the 'Travel Hub' or click on the 'Book Trip' button in the navigation bar. You can choose from trains, flights, and hotels."
  },
  {
    id: 'safety',
    variants: ['safety', 'is it safe', 'emergency', 'help', 'sos'],
    answer: "Your safety is our priority. You can access the 'Safety Dashboard' for emergency contacts, live alerts, and safety guides. In case of emergency, use the SOS button."
  },
  {
    id: 'festivals',
    variants: ['festivals', 'events', 'what is happening', 'culture'],
    answer: "India is a land of festivals! Check out the 'Cultural Odyssey' section to see upcoming festivals, their significance, and dates."
  },
  {
    id: 'sustainable',
    variants: ['sustainable travel', 'eco friendly', 'green travel'],
    answer: "We promote sustainable tourism. Visit the 'Eco Travel' section to find eco-friendly stays, green routes, and tips to reduce your carbon footprint."
  },
  {
    id: 'guides',
    variants: ['local guides', 'find a guide', 'hire guide'],
    answer: "You can connect with verified local guides in the 'Local Guides' section to get an authentic experience of the place you are visiting."
  },
  {
    id: 'login',
    variants: ['login', 'sign in', 'register', 'sign up', 'account'],
    answer: "You can login or create an account by clicking on the 'Sign In' button in the top right corner or accessing the 'Profile' section."
  },
  {
    id: 'support',
    variants: ['contact support', 'customer care', 'help desk'],
    answer: "You can reach our support team via the 'Contact Us' page or email us at support@darshana.com."
  },
  {
    id: 'best-time',
    variants: ['best time to visit', 'weather', 'season'],
    answer: 'The best time to visit depends on the destination. Generally, October to March is great for most of India. Check specific destination details for more info.'
  }
];

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toTokenSet = (value: string): Set<string> => {
  const normalized = normalizeText(value);
  if (!normalized) {
    return new Set();
  }
  return new Set(normalized.split(' ').filter(Boolean));
};

const tokenOverlapScore = (inputTokens: Set<string>, targetTokens: Set<string>): number => {
  if (inputTokens.size === 0 || targetTokens.size === 0) {
    return 0;
  }
  let shared = 0;
  targetTokens.forEach((token) => {
    if (inputTokens.has(token)) {
      shared += 1;
    }
  });
  const precision = shared / targetTokens.size;
  const recall = shared / inputTokens.size;
  return Math.max(precision, recall);
};

const findDynamicKnowledge = (
  normalizedInput: string,
  inputTokens: Set<string>,
  entries: KnowledgeBaseEntry[],
): { entry: KnowledgeBaseEntry; matchedLanguage: 'en' | 'hi'; score: number } | null => {
  let bestEntry: KnowledgeBaseEntry | null = null;
  let bestLanguage: 'en' | 'hi' = 'en';
  let bestScore = 0;

  const considerCandidate = (entry: KnowledgeBaseEntry, rawQuestion?: string, language: 'en' | 'hi' = 'en') => {
    if (!rawQuestion) {
      return;
    }

    const normalizedCandidate = normalizeText(rawQuestion);
    if (!normalizedCandidate) {
      return;
    }

    if (
      normalizedCandidate === normalizedInput ||
      normalizedInput.includes(normalizedCandidate) ||
      normalizedCandidate.includes(normalizedInput)
    ) {
      bestEntry = entry;
      bestLanguage = language;
      bestScore = 1;
      return;
    }

    const score = tokenOverlapScore(inputTokens, toTokenSet(rawQuestion));
    if (score > bestScore) {
      bestEntry = entry;
      bestLanguage = language;
      bestScore = score;
    }
  };

  for (const entry of entries) {
    considerCandidate(entry, entry.question, 'en');
    considerCandidate(entry, entry.questionHi, 'hi');
  }

  if (!bestEntry || bestScore < 0.6) {
    return null;
  }

  return { entry: bestEntry, matchedLanguage: bestLanguage, score: bestScore };
};

const tryStaticKnowledge = (
  normalizedInput: string,
  inputTokens: Set<string>,
): { answer: string; score: number } | null => {
  let best: { answer: string; score: number } | null = null;

  for (const entry of STATIC_KNOWLEDGE_BASE) {
    for (const variant of entry.variants) {
      const normalizedVariant = normalizeText(variant);
      if (!normalizedVariant) {
        continue;
      }

      if (
        normalizedVariant === normalizedInput ||
        normalizedInput.includes(normalizedVariant) ||
        normalizedVariant.includes(normalizedInput)
      ) {
        return { answer: entry.answer, score: 1 };
      }

      const score = tokenOverlapScore(inputTokens, toTokenSet(variant));
      if (!best || score > best.score) {
        best = { answer: entry.answer, score };
      }
    }
  }

  return best && best.score >= 0.6 ? best : null;
};

const findExtendedQA = (
  normalizedInput: string,
  inputTokens: Set<string>,
): { answer: string; score: number } | null => {
  let best: { answer: string; score: number } | null = null;

  for (const entry of ASSISTANT_QA) {
    const normalizedQuestion = normalizeText(entry.question);
    if (!normalizedQuestion) {
      continue;
    }

    if (
      normalizedQuestion === normalizedInput ||
      normalizedInput.includes(normalizedQuestion) ||
      normalizedQuestion.includes(normalizedInput)
    ) {
      return { answer: entry.answer, score: 1 };
    }

    const score = tokenOverlapScore(inputTokens, toTokenSet(entry.question));
    if (!best || score > best.score) {
      best = { answer: entry.answer, score };
    }
  }

  return best && best.score >= 0.6 ? best : null;
};

const extractMapLocation = (text: string): string | undefined => {
  const match = text.match(/(?:in|at|near|visit|place)\s+([A-Za-z\s]+?)(?:\.|,|\?|$)/i);
  return match?.[1]?.trim();
};

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 0, 
      role: 'model', 
      text: 'नमस्ते! मैं सारथी हूँ, आपका AI यात्रा साथी। 🙏\n\nHello! I\'m Sarthi, your AI travel companion. Select a category below or ask me anything about traveling across India!' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [listening, setListening] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: QuickCategory[] = [
    {
      id: 'itinerary',
      label: 'Yatrika (Itinerary)',
      icon: Compass,
      questions: [
        'Plan a 7-day North India itinerary',
        'Best South India tour route',
        'Best time to visit Rajasthan?',
        'Budget itinerary for 5 days'
      ]
    },
    {
      id: 'safety',
      label: 'Safety & Security',
      icon: Shield,
      questions: [
        'Safety tips for solo travelers',
        'Is it safe to travel at night?',
        'Emergency precautions'
      ]
    },
    {
      id: 'emergency',
      label: 'Emergency Numbers',
      icon: AlertCircle,
      questions: [
        'Emergency numbers in India',
        'Tourist helpline numbers',
        'Medical emergency services'
      ]
    },
    {
      id: 'culture',
      label: 'Culture & Language',
      icon: Languages,
      questions: [
        'Essential Hindi phrases',
        'Major festivals in India',
        'Indian dining etiquette'
      ]
    },
    {
      id: 'experience',
      label: 'Experiences',
      icon: Heart,
      questions: [
        'Best adventure activities',
        'Top 10 must-visit destinations',
        'Cultural experiences'
      ]
    },
    {
      id: 'practical',
      label: 'Practical Info',
      icon: MessageSquare,
      questions: [
        'Train vs Bus vs Flight',
        'Currency & payment methods',
        'Visa requirements'
      ]
    }
  ];

  const [dbQuestions, setDbQuestions] = useState<KnowledgeBaseEntry[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const allowAccess = isDemoMode || Boolean(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestionsFromDB();
        setDbQuestions(data);
      } catch {
        // Fallback
      }
    };
    loadQuestions();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = { id: Date.now(), role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (user) {
        await saveChatToDB(user.uid, userMessage);
      }

      const inputTokens = toTokenSet(textToSend);
      const normalizedInput = normalizeText(textToSend);
      let reply = '';
      let detectedLocation: string | undefined;

      const dynamicMatch = findDynamicKnowledge(normalizedInput, inputTokens, dbQuestions);
      if (dynamicMatch) {
        const { entry, matchedLanguage } = dynamicMatch;
        if (matchedLanguage === 'hi') {
          reply = entry.answerHi || entry.answer;
        } else {
          reply = entry.answer || entry.answerHi || '';
        }
      }

      if (!reply) {
        const staticMatch = tryStaticKnowledge(normalizedInput, inputTokens);
        if (staticMatch) {
          reply = staticMatch.answer;
        }
      }

      if (!reply) {
        const extendedMatch = findExtendedQA(normalizedInput, inputTokens);
        if (extendedMatch) {
          reply = extendedMatch.answer;
        }
      }

      if (!reply) {
        reply = await getChatResponse(
          messages.map((m) => ({ text: m.text, role: m.role })),
          textToSend
        );
      }

      detectedLocation = extractMapLocation(reply) || extractMapLocation(textToSend);

      const botMessage: Message = {
        id: Date.now() + 1,
        role: 'model',
        text: reply,
        mapLocation: detectedLocation
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
          text: 'I apologize, but I am having trouble connecting. Please check your connection or try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 min-h-[calc(100vh-90px)] flex flex-col font-sans">
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
        
        {/* Header with DarShana Brand Mark & Language Toggle */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 px-5 py-4 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 p-0.5 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <img src={darshanaIcon} alt="Sarthi" className="w-full h-full rounded-2xl object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg text-white">Sarthi AI</h2>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  GEMINI POWERED
                </span>
              </div>
              <p className="text-xs text-emerald-200">Your Cultural Travel Companion</p>
            </div>
          </div>

          {/* Restyled Language Toggle Pill */}
          <button
            onClick={() => {
              const newLang = i18n.language === 'en' ? 'hi' : 'en';
              i18n.changeLanguage(newLang);
              localStorage.setItem('language', newLang);
            }}
            className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-full text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Toggle Language"
          >
            <Globe size={13} className="text-emerald-300" />
            <span>{i18n.language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>

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
                  
                  {msg.mapLocation && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-orange-600 font-semibold text-xs">
                      <MapPin size={14} />
                      <span>{msg.mapLocation}</span>
                    </div>
                  )}

                  {/* Feedback Buttons: ONLY for actual AI answers (NOT for initial greeting msg.id === 0) */}
                  {isAi && msg.id !== 0 && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-3">
                      <button
                        aria-label="Helpful"
                        onClick={() => handleFeedback(msg.id, 'like')}
                        className={`p-1 rounded-md transition cursor-pointer ${
                          msg.liked ? 'text-orange-600 bg-orange-50' : 'text-stone-400 hover:text-stone-700'
                        }`}
                      >
                        <ThumbsUp size={14} />
                      </button>
                      <button
                        aria-label="Not helpful"
                        onClick={() => handleFeedback(msg.id, 'dislike')}
                        className={`p-1 rounded-md transition cursor-pointer ${
                          msg.disliked ? 'text-stone-700 bg-stone-100' : 'text-stone-400 hover:text-stone-700'
                        }`}
                      >
                        <ThumbsDown size={14} />
                      </button>
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
                <span className="ml-1 text-slate-600 font-medium">Sarthi is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Compact Quick Categories Section (Neutral Cards + Brand Orange/Green Icons) */}
        {messages.length < 5 && (
          <div className="px-4 py-3 bg-white border-t border-stone-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Suggestions
            </span>
            
            {/* Horizontal Scrollable Compact Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                const iconColor = idx % 2 === 0 ? 'text-orange-600' : 'text-emerald-700';
                const isExpanded = selectedCategory === cat.id;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (isExpanded) {
                        setSelectedCategory(null);
                      } else {
                        setSelectedCategory(cat.id);
                        handleSend(cat.questions[0]);
                      }
                    }}
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
              placeholder={t('Ask Sarthi about routes, monuments, culture, safety...')}
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