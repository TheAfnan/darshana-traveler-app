# DarShana Traveler

**DarShana Traveler** is a modern React + TypeScript web application for exploring India's heritage, cultural circuits, and travel destinations. Features include the **Cultural Journey Planner**, **AR Monument Scan & History Guide**, **Curated Travel Hub Expeditions**, **Interactive Festival Calendar**, and **Eco-Transit Route Planner**.

---

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Icons**: Lucide React
- **Typography**: Outfit (Sans-serif) & Playfair Display (Serif)
- **AI & Vision**: Google Gemini 1.5 Flash (Multimodal Landmark & Cultural Planning)
- **Database & Auth**: Firebase

---

## 🛠️ Environment Setup

### 1. Local Development
Copy the template configuration to create your local `.env`:
```bash
cp .env.example .env
```
Edit `.env` and configure your API key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_BACKEND_URL=https://your-backend-url.example.com
```

> **🔑 Get a Gemini API Key**: Obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey). Compatible with both traditional (`AIzaSy...`) and new 2026 (`AQ....`) key formats.

### 2. Production Deployment (Vercel)
When deploying to Vercel:
1. Navigate to **Project Settings** → **Environment Variables**.
2. Add:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API Key
   - `VITE_BACKEND_URL`: (Optional) Your production backend URL
3. Trigger a redeployment.

> [!SECURITY NOTE]
> Never commit `.env` or any real API keys to the repository. The `.gitignore` file is configured to exclude all `.env` files automatically.

---

## 💻 Getting Started

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```

---

## 🏛️ Core Features

- **AR Monument Scanner (`/ar-guide`)**: Point your camera or upload a photo to identify Indian temples, palaces, and forts with real-time architectural insights and historical narratives.
- **Cultural Journey Planner (`/planner`)**: Dynamic season-aware cultural itineraries, TripAdvisor recommendations, and IRCTC low-emission transit routes.
- **Travel Hub (`/travelhub`)**: Cinematic full-bleed video hero and 12+ curated themed expeditions.
- **Festival Calendar (`/festivals`)**: Pan-India spiritual and cultural festival radar.
- **Eco Travel (`/sustainable`)**: Carbon-saving route suggestions and eco-reward tracking.
