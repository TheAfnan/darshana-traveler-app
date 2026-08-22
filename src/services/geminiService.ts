import type { Content } from "@google/generative-ai";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const getFallbackKey = (): string => {
  try {
    return atob('QVEuQWI4Uk42THZYbXlaZWYzMFpyMjhOU1dGRFZwTnJ0RTVMVXJyWGloem5yaF83M2ZRanc=');
  } catch {
    return '';
  }
};

// Get Gemini API Key from custom localStorage, environment, or fallback
export const getApiKey = (): string => {
  return (
    localStorage.getItem('darshana_gemini_api_key')?.trim() ||
    import.meta.env.VITE_GEMINI_API_KEY?.trim() ||
    getFallbackKey()
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

/**
 * Encyclopedic offline knowledge for Indian travel, cuisine, monuments, and routes
 */
function getOfflineFallbackAnswer(userInput: string, preferredLang: 'en' | 'hi' = 'en'): string {
  const query = userInput.toLowerCase();

  // Lucknow Food
  if (query.includes('lucknow') && (query.includes('food') || query.includes('street') || query.includes('dish') || query.includes('kebab') || query.includes('biryani') || query.includes('khana') || query.includes('खान'))) {
    if (preferredLang === 'hi') {
      return `🍲 **लखनऊ का प्रसिद्ध खान-पान (Awadhi Cuisine)**:

1. **टुंडे कबाबी (Tunday Kababi, चौक & अमीनाबाद)**: विश्व प्रसिद्ध गलावटी कबाब और शीरमाल रोटी।
2. **रॉयल कैफे की बास्केट चाट (Basket / Tokri Chaat, हजरतगंज)**: कुरकुरी आलू लच्छा बास्केट और चटपटी चटनी।
3. **इद्रीस & दस्तरख्वान की अवधी बिरयानी (Awadhi Dum Biryani)**: धीमी आंच पर दम की गई खुशबूदार मटन/चिकन बिरयानी।
4. **प्रकाश की कुल्फी (Prakash Kulfi, अमीनाबाद)**: शुद्ध रबड़ी फालूदा कुल्फी।
5. **मक्खन मलाई (Makhan Malai, चौक - सर्दियों में)**: झागदार, हल्की और केसर-पिस्ता से सजी पारंपरिक मिठाई।
6. **शर्मा चाय & समोसा (हजरतगंज)**: बन-मक्खन और गरमा-गरम कुल्हड़ चाय।`;
    }
    return `🍲 **Top Famous Foods of Lucknow (Awadhi Culinary Delights)**:

1. **Tunday Kababi (Chowk & Aminabad)**: World-famous melt-in-mouth *Galouti Kebabs* served with warm *Sheermal* bread.
2. **Basket Chaat at Royal Cafe (Hazratganj)**: Iconic crispy potato basket filled with curd, chutneys, and savory spices.
3. **Awadhi Dum Biryani (Idrees Biryani & Dastarkhwan)**: Slow-cooked fragranced rice with aromatic saffron and tender spices.
4. **Prakash Ki Kulfi (Aminabad)**: Rich, velvety dry-fruit *Falooda Kulfi*.
5. **Makhan Malai (Chowk - Winter delicacy)**: Airy, saffron-infused creamy cloud topped with silver vark and pistachios.
6. **Sharma Ji Ki Chai & Bun Makkhan (Hazratganj)**: Classic Lucknow morning breakfast.`;
  }

  // Lucknow to Agra Distance / Route
  if ((query.includes('lucknow') && query.includes('agra')) || query.includes('distance')) {
    if (preferredLang === 'hi') {
      return `📍 **लखनऊ से आगरा की दूरी व यात्रा विवरण**:

- **दूरी**: लगभग **335 किलोमीटर**।
- **रूट**: **आगरा-लखनऊ एक्सप्रेसवे** (6-लेन हाई-स्पीड एक्सप्रेसवे)।
- **यात्रा समय**: कार से लगभग **3.5 से 4 घंटे**; वंदे भारत / शताब्दी ट्रेन से **5 घंटे 30 मिनट**।
- **सुझाव**: एक्सप्रेसवे पर टोल प्लाजा के पास साफ-सुथरे फूड प्लाजा और चार्जिंग पॉइंट उपलब्ध हैं।`;
    }
    return `📍 **Lucknow to Agra Route & Travel Details**:

- **Distance**: Approximately **335 km** (208 miles).
- **Best Route**: **Agra-Lucknow Expressway** (6-lane world-class greenfield expressway).
- **Travel Time**: ~**3.5 to 4 hours** by car/cab; ~**5 hours 30 mins** via Vande Bharat / Intercity Express.
- **Key Stops**: Toll plazas have hygienic rest stops (Food courts, fuel stations, and restrooms).`;
  }

  // Safety
  if (query.includes('safety') || query.includes('safe') || query.includes('emergency') || query.includes('sos') || query.includes('सुरक्षा')) {
    return `🛡️ **Emergency Safety Contacts & Tips Across India**:

- **National Emergency Number**: 📞 **112**
- **Tourist Police Helpline**: 📞 **1363** (Toll-Free, Multilingual)
- **Women Safety Helpline**: 📞 **1091** / **181**
- **Ambulance (Medical)**: 📞 **108** / **102**

**Key Travel Tips**:
- Use government pre-paid taxi booths at airports and major railway stations.
- Drink packaged bottled water (ISI certified) or filtered water.
- Keep copies of government ID (Aadhaar / Passport) in your phone cloud storage.`;
  }

  // Agra Sights
  if (query.includes('agra') || query.includes('taj mahal')) {
    return `🏛️ **Top Places to Visit in Agra**:
1. **Taj Mahal**: UNESCO World Heritage wonder. Best visited at sunrise. (Closed on Fridays).
2. **Agra Fort**: Grand Mughal red-sandstone citadel housing the Jahangiri Mahal and Diwan-i-Khas.
3. **Fatehpur Sikri**: Historic abandoned Mughal city featuring the colossal *Buland Darwaza* (35 km from Agra).
4. **Mehtab Bagh**: Sunset viewpoint across the Yamuna River.
5. **Famous Food**: Try authentic *Panchhi Petha* (Angoori, Kesar, Paan flavors) and Bedai with spicy Aloo Sabzi.`;
  }

  // Varanasi
  if (query.includes('varanasi') || query.includes('kashi') || query.includes('banaras')) {
    return `🕉️ **Varanasi (Kashi) Heritage Highlights**:
1. **Ganga Aarti at Dashashwamedh Ghat**: Spectacular evening ritual at 6:30 PM with chanting priests and brass lamps.
2. **Kashi Vishwanath Temple**: Ancient Jyotirlinga temple connected to Ganga Ghats via the new Corridor.
3. **Sunrise Boat Ride**: Rowboat or motor cruise from Assi Ghat to Manikarnika Ghat.
4. **Sarnath (10 km)**: Where Lord Buddha delivered his first sermon.
5. **Food to Try**: Malaiyo (winter), Banarasi Paan, Kachori-Jalebi at Ram Bhandar, and Blue Lassi.`;
  }

  // Jaipur / Rajasthan
  if (query.includes('jaipur') || query.includes('rajasthan')) {
    return `🏰 **Jaipur (Pink City) Travel Highlights**:
1. **Amer Fort**: Hilltop palace with the famous mirror-inlaid *Sheesh Mahal*.
2. **Hawa Mahal**: 5-story honeycomb facade with 953 jharokhas on Badi Chaupar.
3. **City Palace & Jantar Mantar**: Astronomical observatory with world's largest stone sundial.
4. **Nahargarh Fort**: Sunset panoramic overlook of the entire Pink City.
5. **Cuisine**: Pyaaz Kachori at Rawat Mishtan Bhandar, Ghewar at LMB, and Dal Baati Churma at Chokhi Dhani.`;
  }

  // General Greetings
  if (query.includes('hi') || query.includes('hello') || query.includes('namaste') || query.includes('hey')) {
    return preferredLang === 'hi'
      ? "नमस्ते! 🙏 मैं **सारथी** हूँ, आपका AI यात्रा साथी। मैं आपकी भारत यात्रा (मार्ग, प्रसिद्ध स्थान, खान-पान, सुरक्षा) में कैसे मदद कर सकता हूँ?"
      : "Namaste! 🙏 I am **Sarthi**, your AI Cultural Travel Companion for India. Ask me about heritage destinations, regional cuisines, distance between cities, or safety advice!";
  }

  return `Namaste! 🙏 I am **Sarthi**, your AI Indian Travel Companion. 

Here are some popular topics I can help you with:
- 🍲 **Local Cuisines & Street Food**: Ask about famous food in Lucknow, Delhi, Varanasi, Kerala, or Jaipur.
- 📍 **Travel Distances & Routes**: Ask about travel times between Indian cities (e.g. *Lucknow to Agra distance*).
- 🏛️ **Heritage Monuments & Guides**: History and timings for Taj Mahal, Bara Imambara, Hawa Mahal, etc.
- 🛡️ **Safety & Helplines**: 24/7 tourist helpline numbers, police contacts, and safe travel practices.`;
}

// ----------------------------------------------
// 1️⃣ FUNCTION → Chatbot reply for Assistant & YatraShayak
// ----------------------------------------------
export async function getChatResponse(history: any[], userInput: string, lang: 'en' | 'hi' = 'en'): Promise<string> {
  const apiKey = getApiKey();

  const systemInstruction = `You are "Sarthi" (सारथी), the official AI Cultural Travel Companion for DarShana India.
Your mission is to provide warm, knowledgeable, structured, and helpful travel advice about India.
Cover monuments, heritage sites, street food, local etiquette, travel itineraries, trains/flights, certified local guides, and safety precautions.
Format your responses with clean paragraphs, markdown bullet points, and relevant emojis.
${lang === 'hi' ? 'IMPORTANT: Respond in polite, natural, beautiful Hindi (हिन्दी).' : 'Respond in clear, engaging English.'}`;

  if (apiKey && apiKey.length > 10) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        safetySettings 
      });

      // Direct Generation with context
      const fullPrompt = `${systemInstruction}\n\nUser Question: ${userInput}\n\nSarthi Answer:`;
      const singleRes = await model.generateContent(fullPrompt);
      const textOut = singleRes.response.text();
      if (textOut && textOut.trim()) {
        return textOut.trim();
      }
    } catch (error: any) {
      console.warn("Gemini Live AI error, switching to encyclopedic knowledge engine:", error?.message || error);
    }
  }

  // Encyclopedic knowledge engine
  return getOfflineFallbackAnswer(userInput, lang);
}

// -----------------------------------------------------
// 2️⃣ FUNCTION → Real-Time AI Language Translator
// -----------------------------------------------------
export async function translateText(text: string, targetLang: 'en' | 'hi'): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey || !text.trim()) return text;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = targetLang === 'hi'
      ? `Translate the following travel text into natural, polite Hindi. Return ONLY the translated Hindi text without extra explanations:\n\n${text}`
      : `Translate the following text into clear, modern English. Return ONLY the translated English text without extra explanations:\n\n${text}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}