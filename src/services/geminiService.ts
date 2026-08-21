import type { Content } from "@google/generative-ai";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Get Gemini API Key from environment
const getApiKey = (): string => {
  return import.meta.env.VITE_GEMINI_API_KEY?.trim() || "";
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
 * Offline intelligent fallback for travel assistant when API key is missing or backend fails
 */
function getOfflineFallbackAnswer(userInput: string, isKeyProvided = false): string {
  const query = userInput.toLowerCase();
  
  if (query.includes('hi') || query.includes('hello') || query.includes('namaste') || query.includes('hey')) {
    return "Namaste! I am Sarthi, your travel companion. How can I assist you with your Indian travel plans today?";
  }
  if (query.includes('safety') || query.includes('safe') || query.includes('emergency') || query.includes('sos')) {
    return "Safety Tip: Always share your live location with trusted contacts, keep emergency numbers (112 / 1091) handy, and check safety scores in our Safety Dashboard!";
  }
  if (query.includes('festival') || query.includes('event') || query.includes('diwali') || query.includes('holi')) {
    return "India is rich in cultural festivals! Check out our 'Cultural Odyssey' section for upcoming festival dates, locations, and travel tips.";
  }
  if (query.includes('book') || query.includes('flight') || query.includes('train') || query.includes('hotel')) {
    return "You can explore and plan your travel options in our 'Travel Hub' or 'Booking' section. We offer smart suggestions for flights, trains, and stays.";
  }
  if (query.includes('monument') || query.includes('scan') || query.includes('history') || query.includes('ar') || query.includes('landmark')) {
    return "Try our 'AR Monument Guide'! Point your camera or upload a photo of any Indian landmark or temple to discover its architecture and centuries of history.";
  }
  if (query.includes('sustainable') || query.includes('green') || query.includes('eco')) {
    return "Explore our 'Green Route Planner' to find low-carbon transport options and earn Eco-Rewards on your travels!";
  }

  if (isKeyProvided) {
    return "I'm ready to help you explore India! (Your API key is active. Ask me about travel routes, safety, festivals, bookings, or destinations).";
  }

  return "I'm ready to help you explore India! (Tip: Set VITE_GEMINI_API_KEY in your .env file for AI-powered responses, or ask me about safety, festivals, bookings, and destinations).";
}

// ----------------------------------------------
// 1️⃣ FUNCTION → Chatbot reply for Assistant & YatraShayak
// ----------------------------------------------
export async function getChatResponse(history: any[], userInput: string): Promise<string> {
  const apiKey = getApiKey();
  const model = getGenerativeModel("gemini-1.5-flash");

  if (!model || !apiKey) {
    console.warn("⚠️ VITE_GEMINI_API_KEY is not set in .env. Using fallback response.");
    return getOfflineFallbackAnswer(userInput, false);
  }

  try {
    const formattedHistory = history.reduce<Content[]>(
      (acc, msg) => {
        const text = typeof msg.text === "string" ? msg.text.trim() : "";
        if (!text) {
          return acc;
        }

        acc.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text }],
        });

        return acc;
      },
      []
    );

    while (formattedHistory.length > 0 && formattedHistory[0]?.role !== "user") {
      formattedHistory.shift();
    }

    const chatSession = model.startChat({
      safetySettings,
      history: formattedHistory,
    });

    const result = await chatSession.sendMessage(userInput);
    return result.response.text();
  } catch (error: any) {
    const errMessage = error?.message || String(error);
    console.error("Gemini chat error:", errMessage);

    if (errMessage.includes("429") || errMessage.includes("Quota exceeded") || errMessage.includes("quota")) {
      return "⚠️ **Gemini API Quota Exceeded (Error 429)**: The API key provided has run out of free request quota on Google AI Studio (limit: 0). Please generate a fresh, free key at [Google AI Studio](https://aistudio.google.com/app/apikey) and update your `VITE_GEMINI_API_KEY`.";
    }

    if (errMessage.includes("API key not valid") || errMessage.includes("400") || errMessage.includes("403")) {
      return "⚠️ **Invalid Gemini API Key**: The key provided is invalid or disabled for standard Gemini models. Please get a valid API key starting with `AIzaSy...` from [Google AI Studio](https://aistudio.google.com/app/apikey).";
    }

    return getOfflineFallbackAnswer(userInput, true);
  }
}

// -----------------------------------------------------
// 2️⃣ FUNCTION → Festival Insight for Festivals
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
// 3️⃣ FUNCTION → Sustainable Route Options
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