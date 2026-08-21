import { GoogleGenerativeAI } from "@google/generative-ai";

// Debug utility to check Gemini API configuration
export async function debugGeminiSetup() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  console.log("🔍 GEMINI API DEBUG INFO:");
  console.log("═════════════════════════════════════════════");

  if (!apiKey) {
    console.error("❌ ERROR: VITE_GEMINI_API_KEY is NOT set!");
    console.error("   Fix: Add VITE_GEMINI_API_KEY to .env.local");
    console.error("   Steps: See GEMINI_SETUP_HINDI.txt or GEMINI_SETUP_ENGLISH.txt");
    return false;
  }

  console.log("✅ API Key found (configured with length " + apiKey.length + ")");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("✅ GoogleGenerativeAI initialized");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("✅ Model loaded: gemini-1.5-flash");

    // Try a test request
    try {
      const result = await model.generateContent("Say 'Test successful'");
      const text = result.response.text();
      console.log("✅ TEST REQUEST SUCCESSFUL!");
      console.log("   Response:", text.substring(0, 50) + "...");
      return true;
    } catch (testError: any) {
      console.error("❌ TEST REQUEST FAILED!");
      console.error("   Error:", testError.message);
      if (testError.message.includes("401") || testError.message.includes("Unauthorized")) {
        console.error("   → This means your API key is INVALID");
        console.error("   → Get a new key from: https://aistudio.google.com/app/apikey");
      }
      return false;
    }
  } catch (error: any) {
    console.error("❌ INITIALIZATION ERROR:", error.message);
    return false;
  }
}

// Call this on component mount to debug
export function logGeminiStatus() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      "%cGEMINI API KEY MISSING!%c\n" +
      "Add this to .env.local:\n" +
      "VITE_GEMINI_API_KEY=your_key_here\n\n" +
      "Get key from: https://aistudio.google.com/app/apikey",
      "color: red; font-weight: bold; font-size: 16px;",
      "color: orange; font-size: 14px;"
    );
  }
}
