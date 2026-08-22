import type { Content } from "@google/generative-ai";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Get Gemini API Key from custom localStorage or environment
export const getApiKey = (): string => {
  return (
    localStorage.getItem('darshana_gemini_api_key')?.trim() ||
    import.meta.env.VITE_GEMINI_API_KEY?.trim() ||
    ""
  );
};

export const setCustomApiKey = (key: string): void => {
  if (key && key.trim()) {
    localStorage.setItem('darshana_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('darshana_gemini_api_key');
  }
};

// Safety Settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

// Helper to get active Gemini Generative Model safely
function getGenerativeModel(modelName = "gemini-1.5-flash") {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: modelName });
  } catch (err) {
    console.error("❌ Failed to initialize GoogleGenerativeAI:", err);
    return null;
  }
}

/**
 * Intelligent fallback for travel assistant when API key is not provided or network is offline
 */
function getOfflineFallbackAnswer(userInput: string, preferredLang: 'en' | 'hi' = 'en'): string {
  const query = userInput.toLowerCase();
  
  if (preferredLang === 'hi') {
    if (query.includes('hi') || query.includes('hello') || query.includes('namaste') || query.includes('नमस्ते') || query.includes('सारथी')) {
      return "नमस्ते! 🙏 मैं **सारथी** हूँ, आपका AI यात्रा साथी। आज मैं आपकी भारत यात्रा में क्या सहायता कर सकता हूँ?";
    }
    if (query.includes('safety') || query.includes('सुरक्षा') || query.includes('emergency') || query.includes('sos')) {
      return "🛡️ **सुरक्षा सुझाव**: हमेशा अपनी लाइव लोकेशन विश्वसनीय संपर्कों के साथ साझा करें। आपातकालीन नंबर: पुलिस (112 / 100), महिला हेल्पलाइन (1091), पर्यटक हेल्पलाइन (1363)।";
    }
    if (query.includes('festival') || query.includes('त्योहार') || query.includes('diwali') || query.includes('holi')) {
      return "🎉 **सांस्कृतिक उत्सव**: भारत त्योहारों की भूमि है! आगामी त्योहारों की तिथियों और स्थानों के लिए हमारा 'Cultural Odyssey' अनुभाग देखें।";
    }
    if (query.includes('guide') || query.includes('गाइड') || query.includes('booking')) {
      return "🏛️ **स्थानीय गाइड**: आप हमारे 'Local Guides' सेक्शन में भारत भर के सत्यापित, सरकारी प्रमाणित टूर गाइड बुक कर सकते हैं।";
    }
    return `नमस्ते! आपकी यात्रा योजना के लिए मैं हमेशा तैयार हूँ। आप मुझसे यात्रा मार्ग, प्रसिद्ध स्मारकों, खान-पान या सुरक्षा के बारे में पूछ सकते हैं। (सुझाव: फुल AI रिस्पॉन्स के लिए API Key सेट करें)`;
  }

  if (query.includes('hi') || query.includes('hello') || query.includes('namaste') || query.includes('hey')) {
    return "Namaste! 🙏 I am **Sarthi**, your AI travel companion. How can I help you plan your journey across India today?";
  }
  if (query.includes('safety') || query.includes('safe') || query.includes('emergency') || query.includes('sos')) {
    return "🛡️ **Safety Tip**: Always share your live location with trusted contacts. Emergency numbers: Police (112), Women Helpline (1091), Tourist Helpline (1363). Check our Safety Dashboard for real-time safety scores!";
  }
  if (query.includes('festival') || query.includes('event') || query.includes('diwali') || query.includes('holi')) {
    return "🎉 **Cultural Festivals**: Check out our 'Cultural Odyssey' section to explore vibrant Indian festivals, rituals, dates, and destinations.";
  }
  if (query.includes('guide') || query.includes('tour')) {
    return "🏛️ **Verified Local Guides**: You can book certified local guides across Agra, Varanasi, Jaipur, and 20+ cities in our 'Local Guides' directory.";
  }
  if (query.includes('book') || query.includes('flight') || query.includes('train') || query.includes('hotel')) {
    return "✈️ **Travel Hub**: Visit our 'Travel Hub' to plan and book trains, flights, eco-stays, and personalized heritage itineraries.";
  }

  return "I am ready to help you explore India! Ask me about itineraries, hidden gems, street food, verified local guides, or emergency safety precautions. (Tip: You can add your Gemini API Key in the top header setup for unlimited AI queries).";
}

// ----------------------------------------------
// 1️⃣ FUNCTION → Chatbot reply for Assistant & YatraShayak
// ----------------------------------------------
export async function getChatResponse(history: any[], userInput: string, lang: 'en' | 'hi' = 'en'): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey || apiKey.length < 5) {
    return getOfflineFallbackAnswer(userInput, lang);
  }

  const systemInstruction = `You are "Sarthi" (सारथी), the official AI Cultural Travel Companion for DarShana India.
Your mission is to provide warm, knowledgeable, structured, and helpful travel advice about India.
Cover monuments, heritage sites, street food, local etiquette, travel itineraries, trains/flights, certified local guides, and safety precautions.
Format your responses with clean paragraphs, markdown bullet points, and relevant emojis.
${lang === 'hi' ? 'IMPORTANT: Respond in polite, natural, beautiful Hindi (हिन्दी).' : 'Respond in clear, engaging English.'}`;

  // Try direct generation with full context first for maximum reliability
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings 
    });

    // Build alternating history cleanly
    const formattedHistory: Content[] = [];
    let lastRole = '';

    for (const msg of history || []) {
      const text = typeof msg.text === "string" ? msg.text.trim() : "";
      if (!text) continue;

      const isUser = msg.role === 'user' || msg.type === 'user' || msg.sender === 'user';
      const role = isUser ? 'user' : 'model';

      if (role !== lastRole) {
        formattedHistory.push({
          role,
          parts: [{ text }]
        });
        lastRole = role;
      }
    }

    // Ensure history starts with user
    while (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
      formattedHistory.shift();
    }

    // Attempt Multi-turn chat
    if (formattedHistory.length > 0) {
      try {
        const chat = model.startChat({
          history: formattedHistory,
          safetySettings
        });
        const langNote = lang === 'hi' ? ' (कृपया हिन्दी में उत्तर दें)' : '';
        const res = await chat.sendMessage(userInput + langNote);
        const out = res.response.text();
        if (out && out.trim()) return out.trim();
      } catch (chatErr) {
        console.warn("Multi-turn chat error, falling back to direct prompt:", chatErr);
      }
    }

    // Direct Single-Turn Prompt with System Context
    const fullPrompt = `${systemInstruction}\n\nUser Question: ${userInput}\n\nSarthi Answer:`;
    const singleRes = await model.generateContent(fullPrompt);
    const textOut = singleRes.response.text();
    if (textOut && textOut.trim()) {
      return textOut.trim();
    }
  } catch (error: any) {
    const errMessage = error?.message || String(error);
    console.error("Gemini chat error:", errMessage);

    if (errMessage.includes("429") || errMessage.includes("Quota") || errMessage.includes("quota")) {
      return lang === 'hi'
        ? "⚠️ **Gemini API कोटा समाप्त**: इस API Key का कोटा पूरा हो गया है। कृपया Google AI Studio से नई फ्री Key प्राप्त करें।"
        : "⚠️ **Gemini API Quota Exceeded**: The API key has reached its request limit. Please update the API key via the setup modal.";
    }

    if (errMessage.includes("API key not valid") || errMessage.includes("invalid") || errMessage.includes("API_KEY_INVALID")) {
      return lang === 'hi'
        ? "⚠️ **अमान्य API Key**: दर्ज की गई Gemini API Key अमान्य है। कृपया [Google AI Studio](https://aistudio.google.com/app/apikey) से सही API Key कॉपी करके 'API Setup' में पेस्ट करें।"
        : "⚠️ **Invalid API Key**: The configured Gemini API key is not valid. Please copy a valid key from [Google AI Studio](https://aistudio.google.com/app/apikey) and update it.";
    }
  }

  return getOfflineFallbackAnswer(userInput, lang);
}

// -----------------------------------------------------
// 2️⃣ FUNCTION → Real-Time AI Language Translator
// -----------------------------------------------------
export async function translateText(text: string, targetLang: 'Hindi' | 'English'): Promise<string> {
  if (!text || !text.trim()) return '';

  const model = getGenerativeModel();
  if (!model) {
    // Quick localized fallback for standard travel terms
    if (targetLang === 'Hindi') {
      if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('welcome')) return 'नमस्ते! दर्शना में आपका स्वागत है।';
      if (text.toLowerCase().includes('safety')) return 'सुरक्षा सुझाव: हमेशा सतर्क रहें और आपातकालीन नंबर 112 डायल करें।';
      return `[अनुवाद - हिन्दी]: ${text}`;
    } else {
      if (text.includes('नमस्ते')) return 'Namaste! Welcome to DarShana.';
      return `[Translation - English]: ${text}`;
    }
  }

  try {
    const prompt = `Translate the following text into natural, fluent ${targetLang}. Keep emojis and proper names intact. Output ONLY the translated text without explanations:\n\n"${text}"`;
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });
    return result.response.text().trim();
  } catch (err) {
    console.warn("Translation fallback:", err);
    return targetLang === 'Hindi' ? `[अनुवाद]: ${text}` : `[Translation]: ${text}`;
  }
}

// -----------------------------------------------------
// 3️⃣ FUNCTION → Festival Insight for Festivals
// -----------------------------------------------------
export async function getFestivalDetails(festivalName: string): Promise<string> {
  const model = getGenerativeModel();
  if (!model) {
    return `${festivalName} is a celebrated Indian festival filled with vibrant traditions, music, and community spirit. Visit during its main event days for an incredible experience.`;
  }

  try {
    const prompt = `Explain the cultural, historical, and tourism significance of the Indian festival "${festivalName}". Make it short, helpful, and easy to understand for travelers.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    return result.response.text();
  } catch (error) {
    console.error("Festival fetch error:", error);
    return `${festivalName} is a celebrated Indian festival filled with vibrant traditions, music, and community spirit.`;
  }
}

// -----------------------------------------------------
// 4️⃣ FUNCTION → Sustainable Route Options
// -----------------------------------------------------
export async function getSustainableRouteOptions(from: string, to: string): Promise<string> {
  const model = getGenerativeModel();
  if (!model) {
    return `Sustainable Route Options from ${from} to ${to}:\n1. Express Electric Train: Low carbon emission, comfortable journey.\n2. Eco Bus Service: Shared transit with scenic route views.\n3. Electric Vehicle (EV) Rental: Flexible eco-travel for road trips.`;
  }

  try {
    const prompt = `Suggest 3-5 sustainable, eco-friendly travel options for going from "${from}" to "${to}" in India. For each, provide: name, short route, a one-sentence description, and top eco-friendly tips. Respond in markdown table format or as a short structured list.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    return result.response.text();
  } catch (error) {
    console.error("Eco route fetch error:", error);
    return `Unable to fetch dynamic AI route. Suggested options from ${from} to ${to}: Electric Train or Shared Eco-Bus.`;
  }
}