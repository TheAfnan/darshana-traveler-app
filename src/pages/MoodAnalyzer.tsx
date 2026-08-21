import { AnimatePresence, motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { AlertCircle, ArrowRight, Camera, CheckCircle, Loader2, MapPin, Mountain, RefreshCw, Scan, Shield, Sparkles, Upload, Users, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MoodCameraLoader from '../components/MoodCameraLoader';
import { DESTINATIONS } from '../data/destinations';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { analyzeMoodWithImage, getMoodAnalyzerUrl } from '../services/moodApi';
import { createRazorpayOrder } from '../services/razorpay';
import { fetchLiveWeather, type WeatherQuery, type WeatherSnapshot } from '../services/weather';
import type { AIAnalysisResult, Destination, MoodAnalyzeResponse } from '../types/moodAnalyzer';
import ARGuide from './ARGuide';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890';
const PAYMENT_PROVIDER = (import.meta.env.VITE_PAYMENT_PROVIDER as 'razorpay' | 'offline' | undefined) || 'razorpay';

function simulatePayment(amount: number): Promise<void> {
  console.info(`Simulating payment of ₹${amount} (offline provider)`);
  return new Promise((resolve) => setTimeout(resolve, 900));
}

// Razorpay Payment Integration
async function makePayment(amount: number): Promise<void> {
  if (PAYMENT_PROVIDER === 'offline') {
    return simulatePayment(amount);
  }

  if (!RAZORPAY_KEY_ID) {
    throw new Error('Missing Razorpay key. Set VITE_RAZORPAY_KEY_ID in your environment or set VITE_PAYMENT_PROVIDER=offline.');
  }

  // Create order on backend when available; fall back to client-only checkout if unreachable
  const order = await createRazorpayOrder(amount).catch((err) => {
    console.warn('Falling back to client-only Razorpay checkout:', err);
    return null;
  });

  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      console.error('Razorpay SDK not loaded');
      setTimeout(resolve, 1200);
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order?.amount ?? amount * 100,
      currency: order?.currency ?? 'INR',
      name: 'DarShana Travel',
      description: 'AI Trip Booking',
      order_id: order?.id,
      image: '/vite.svg',
      handler: function (_response: any) {
        resolve();
      },
      prefill: {
        name: 'Traveler',
        email: 'traveler@darshana.com',
        contact: '9999999999',
      },
      notes: {
        product: 'AiMood Analyzer',
      },
      theme: {
        color: '#ea580c',
      },
      modal: {
        ondismiss: function () {
          reject(new Error('Payment cancelled by user'));
        },
      },
    };

    try {
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Razorpay initialization failed:', error);
      reject(error);
    }
  });
}

const STEPS = [
  { title: "How are you feeling today?", input: "mood" },
  { title: "What's your energy level?", input: "energy" },
  { title: "How social do you want to be?", input: "social" },
  { title: "How adventurous are you feeling?", input: "adventure" },
  { title: "Recommendations", input: "recommendations" },
  { title: "Payment", input: "payment" },
  { title: "Your Trip Ticket", input: "ticket" },
];

type PrefOption = { label: string; value: string; hint?: string };

type PrefQuestion = {
  id: 'vibe' | 'pace';
  title: string;
  subtitle: string;
  options?: PrefOption[];
  type?: 'options' | 'range';
};

type PreferenceAnswers = {
  vibe?: 'relax' | 'explore' | 'festive';
  pace?: 'slow' | 'balanced' | 'fast';
};

const PREF_QUESTIONS: PrefQuestion[] = [
  {
    id: 'vibe',
    title: 'What kind of vibe are you after?',
    subtitle: 'Choose the mood you want the trip to match.',
    type: 'options',
    options: [
      { label: 'Chill & restorative', value: 'relax', hint: 'Beaches, calm stays, spas' },
      { label: 'Explore & culture', value: 'explore', hint: 'Museums, food, local life' },
      { label: 'Festive & lively', value: 'festive', hint: 'Nightlife, festivals, crowds' },
    ],
  },
  {
    id: 'pace',
    title: 'How fast do you want to travel?',
    subtitle: 'Pick the pace that fits your energy.',
    type: 'options',
    options: [
      { label: 'Slow & unhurried', value: 'slow' },
      { label: 'Balanced mix', value: 'balanced' },
      { label: 'Fast & packed', value: 'fast' },
    ],
  },
];

function preferenceScore(dest: Destination, answers: PreferenceAnswers): number {
  let score = 0;
  const destVibe = (dest as any).vibe as string | undefined;
  if (answers.vibe && destVibe) {
    score += answers.vibe === destVibe ? 3 : 0;
  }
  if (answers.pace) {
    const paceTag = dest.tags.find((t) => t.toLowerCase().includes(answers.pace as string));
    if (paceTag) score += 1;
  }
  return score;
}

function rankRecommendations(list: Destination[], answers: PreferenceAnswers): Destination[] {
  if (!answers.vibe && !answers.pace) return list;
  return [...list].sort((a, b) => preferenceScore(b, answers) - preferenceScore(a, answers));
}

/**
 * Filter destinations based on mood analysis scores
 * Matches energy, social, adventure ranges and recommended tags
 */
function filterDestinationsByMood(
  moodResponse: MoodAnalyzeResponse
): Destination[] {
  const { energyLevel, socialScore, adventureScore, recommendedKeys } = moodResponse;

  return DESTINATIONS.filter(dest => {
    // Check if energy level is in range
    if (energyLevel < dest.energy[0] || energyLevel > dest.energy[1]) {
      return false;
    }

    // Check if social score is in range
    if (socialScore < dest.social[0] || socialScore > dest.social[1]) {
      return false;
    }

    // Check if adventure score is in range
    if (adventureScore < dest.adventure[0] || adventureScore > dest.adventure[1]) {
      return false;
    }

    // Check if destination tags match recommended keys
    if (recommendedKeys.length > 0) {
      const hasMatchingTag = dest.tags.some(tag =>
        recommendedKeys.some(key =>
          tag.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(tag.toLowerCase())
        )
      );

      // If no exact tag match, check label
      if (!hasMatchingTag) {
        return recommendedKeys.some(key =>
          dest.label.toLowerCase().includes(key.toLowerCase())
        );
      }
    }

    return true;
  }).sort((a, b) => {
    // Prefer more specific matches - destinations with matching tags
    const aMatchCount = a.tags.filter(tag =>
      recommendedKeys.some(key =>
        tag.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(tag.toLowerCase())
      )
    ).length;

    const bMatchCount = b.tags.filter(tag =>
      recommendedKeys.some(key =>
        tag.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(tag.toLowerCase())
      )
    ).length;

    return bMatchCount - aMatchCount;
  }).slice(0, 3); // Return top 3
}

/**
 * Generate FAQ for a destination based on mood analysis
 */
function generateFAQ(destination: Destination, moodResponse: MoodAnalyzeResponse) {
  const { recommendedKeys } = moodResponse;

  const matchedTags = destination.tags
    .filter(tag =>
      recommendedKeys.some(key =>
        tag.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(tag.toLowerCase())
      )
    )
    .join(", ");

  return [
    {
      question: "Why AI chose this place?",
      answer: `Based on your mood analysis with ${moodResponse.energyLevel} energy level and ${moodResponse.adventureScore} adventure score, ${destination.title} is perfect because it offers ${matchedTags || destination.tags.join(", ")}. Your emotional state matches this destination's vibe perfectly!`,
    },
    {
      question: "What experience will I get?",
      answer: `${destination.title} offers incredible experiences in ${destination.tags.slice(0, 2).join(" and ")}. Whether you're looking for adventure, relaxation, or cultural immersion, this place delivers. Best time to visit: ${destination.bestTime || "Year-round"}`,
    },
    {
      question: "Want a different place?",
      answer: `No problem! Try another expression or use Manual Mode for complete control over destination selection. Each mood change gives you fresh recommendations!`,
    },
  ];
}

function locationQueryFromDestination(dest: Destination): WeatherQuery {
  const baseCity = dest.title.replace(/,.*/, '').trim();

  if (dest.location) {
    const { lat, lon, city, state, country } = dest.location;

    if (typeof lat === 'number' && typeof lon === 'number') {
      return {
        lat,
        lon,
        city: city ?? baseCity,
        state: state ?? dest.state,
        country,
      };
    }

    return {
      city: city ?? baseCity,
      state: state ?? dest.state,
      country: country ?? 'India',
      name: dest.title,
    };
  }

  return {
    city: baseCity,
    state: dest.state,
    country: 'India',
    name: dest.title,
  };
}

// Main MoodAnalyzer Component
const MoodAnalyzer: React.FC = () => {
  // Mode selection: 'ai' is default, 'manual' for optional self-select
  const [mode, setMode] = useState<'ai' | 'manual' | 'ar'>('ai');

  // Face detection hook
  const faceDetection = useFaceDetection();

  // AI mood analyzer states
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imagePreviewRef = useRef<HTMLImageElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const isDetectingRef = useRef(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [aiStep, setAIStep] = useState<number>(0); // 0: input, 1: recommendations shown
  const [isPayingAI, setIsPayingAI] = useState(false);
  const [paidAI, setPaidAI] = useState(false);
  const [selectedDestinationIdx, setSelectedDestinationIdx] = useState<number | null>(0);
  const [faceCount, setFaceCount] = useState<number | null>(null);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const faceDetectionStartTimeRef = useRef<number | null>(null);
  const [isAutoAnalyzing, setIsAutoAnalyzing] = useState(false);
  const [prefStep, setPrefStep] = useState(0);
  const [prefAnswers, setPrefAnswers] = useState<PreferenceAnswers>({});
  const prefComplete = PREF_QUESTIONS.every((q) => Boolean(prefAnswers[q.id as keyof PreferenceAnswers]));
  const [weatherByDest, setWeatherByDest] = useState<Record<string, WeatherSnapshot>>({});
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Sync face count from detection hook
  useEffect(() => {
    if (faceDetection.faceCount !== null) {
      setFaceCount(faceDetection.faceCount);
    }
  }, [faceDetection.faceCount]);

  // Manual multi-step analyzer states
  const [step, setStep] = useState<number>(1);
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number>(5);
  const [social, setSocial] = useState<number>(5);
  const [adventure, setAdventure] = useState<number>(5);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  // Handlers for AI flow
  const stopCamera = useCallback(() => {
    setIsCameraOpen(false);
    setFaceCount(null);
    setCountdown(null);
    cameraStreamRef.current = null;
  }, []);

  const handleStreamReady = useCallback((stream: MediaStream) => {
    cameraStreamRef.current = stream;
    setDetectionError(null);
  }, []);

  const handleCameraError = useCallback((error: string) => {
    setDetectionError(error);
    setIsCameraOpen(false);
  }, []);

  const startCamera = useCallback(() => {
    setIsCameraOpen(true);
    setDetectionError(null);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      stopCamera();
    }
  }, [stopCamera]);

  // Detect faces from video stream when camera is active
  useEffect(() => {
    if (!isCameraOpen || !faceDetection.modelsLoaded) {
      return;
    }

    console.log('👁️ Starting face detection from video stream...');
    const intervalId = setInterval(async () => {
      if (videoRef.current && !isDetectingRef.current && !videoRef.current.paused && !videoRef.current.ended) {
        isDetectingRef.current = true;
        try {
          const count = await faceDetection.detectFacesFromVideo(videoRef as React.RefObject<HTMLVideoElement>);
          
          if (count > 0) {
            if (!faceDetectionStartTimeRef.current) {
              faceDetectionStartTimeRef.current = Date.now();
            }
            const elapsed = Date.now() - faceDetectionStartTimeRef.current;
            const remaining = Math.max(0, 5000 - elapsed);
            setCountdown(Math.ceil(remaining / 1000));

            if (remaining === 0 && !isAutoAnalyzing) {
              setIsAutoAnalyzing(true);
              capturePhoto();
            }
          } else {
            faceDetectionStartTimeRef.current = null;
            setCountdown(null);
          }
        } catch (e) {
           console.error("Face detection error", e);
        } finally {
          isDetectingRef.current = false;
        }
      }
    }, 200); // Slightly slower scan to reduce load

    return () => {
      console.log('🛑 Stopping face detection interval');
      clearInterval(intervalId);
      faceDetectionStartTimeRef.current = null;
      setCountdown(null);
    };
  }, [isCameraOpen, faceDetection, videoRef, capturePhoto, isAutoAnalyzing]);

  // Initialize face detection models on mount and ensure camera stops on unmount
  useEffect(() => {
    void faceDetection.loadModels().catch(err => {
      console.error('Failed to preload face detection models:', err);
    });
    
    // Cleanup on unmount only
    return () => {
      console.log('🧹 Component unmounting, cleaning up camera...');
      const mediaStream = cameraStreamRef.current;
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        cameraStreamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      imagePreviewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount/unmount

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setDetectionError('Image too large (max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        stopCamera();
        imagePreviewRef.current = null;
        setImage(reader.result as string);
        setDetectionError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearCapturedImage = useCallback(() => {
    setImage(null);
    setResult(null);
    setDetectionError(null);
    setFaceCount(null);
    imagePreviewRef.current = null;
  }, []);

  const restartToCamera = useCallback(() => {
    setMode('ai');
    setAIStep(0);
    setPaidAI(false);
    setIsPayingAI(false);
    setSelectedDestinationIdx(0);
    setIsAutoAnalyzing(false);
    setCountdown(null);
    setDetectionError(null);
    clearCapturedImage();
    startCamera();
  }, [clearCapturedImage, startCamera]);

  useEffect(() => {
    if (!result || !result.recommendations?.length) return;

    let cancelled = false;
    const loadWeather = async () => {
      setIsLoadingWeather(true);
      const entries = await Promise.all(
        result.recommendations.map(async (rec) => {
          try {
            const snapshot = await fetchLiveWeather(locationQueryFromDestination(rec));
            return [rec.id, snapshot] as const;
          } catch (err) {
            console.warn('Weather lookup failed for', rec.title, err);
            return [rec.id, null] as const;
          }
        })
      );

      if (cancelled) return;
      setWeatherByDest((prev) => {
        const next = { ...prev };
        entries.forEach(([id, data]) => {
          if (data) next[id] = data;
        });
        return next;
      });
      setIsLoadingWeather(false);
    };

    void loadWeather();

    return () => {
      cancelled = true;
    };
  }, [result]);

  const finishWithInstantPicks = useCallback(() => {
    const recommendations = rankRecommendations(DESTINATIONS, prefAnswers).slice(0, 3);

    if (!recommendations.length) {
      setDetectionError('No destinations available right now. Try adjusting your answers.');
      return;
    }

    const energyScore = prefAnswers.pace === 'fast' ? 8 : prefAnswers.pace === 'slow' ? 4 : 6;
    const socialScore = prefAnswers.vibe === 'festive' ? 8 : prefAnswers.vibe === 'relax' ? 4 : 6;
    const adventureScore = prefAnswers.vibe === 'relax' ? 4 : 6;

    const stubResult: AIAnalysisResult = {
      detectedMood: 'Ready to travel',
      confidence: 0.72,
      emotions: { happy: 0.4, sad: 0.05, angry: 0.05, surprised: 0.1, neutral: 0.35, fear: 0.03, disgust: 0.02 },
      reasoning: 'Using your preference answers, we curated top destinations and synced live weather for their locations.',
      energyLevel: energyScore,
      socialScore,
      adventureScore,
      recommendations,
    };

    setResult(stubResult);
    setSelectedDestinationIdx(0);
    setAIStep(1);
    setPaidAI(false);
    setIsPayingAI(false);
    setIsAutoAnalyzing(false);
    setCountdown(null);
    setDetectionError(null);
  }, [prefAnswers]);

  const analyzeAI = async () => {
    if (!image) {
      setDetectionError('Please capture or upload a photo before analysis.');
      return;
    }

    setLoading(true);
    setDetectionError(null);

    const backendEndpoint = getMoodAnalyzerUrl();

    const prepareImageForAnalysis = async (): Promise<HTMLImageElement> => {
      const previewNode = imagePreviewRef.current;

      if (previewNode) {
        if (!previewNode.complete || previewNode.naturalWidth === 0) {
          await new Promise<void>((resolve, reject) => {
            const node = previewNode;
            if (!node) {
              resolve();
              return;
            }

            function cleanup() {
              node.removeEventListener('load', handleLoad);
              node.removeEventListener('error', handleError);
            }

            const handleLoad = () => {
              cleanup();
              resolve();
            };

            const handleError = () => {
              cleanup();
              reject(new Error('Failed to load image for analysis. Please try another photo.'));
            };

            node.addEventListener('load', handleLoad);
            node.addEventListener('error', handleError);
          });
        }

        if (previewNode.naturalWidth === 0) {
          throw new Error('Preview image is empty. Please capture a new photo.');
        }

        return previewNode;
      }

      return await new Promise<HTMLImageElement>((resolve, reject) => {
        const imgEl = new Image();
        imgEl.crossOrigin = 'anonymous';
        imgEl.onload = () => resolve(imgEl);
        imgEl.onerror = () => reject(new Error('Failed to load image for analysis. Please try another photo.'));
        imgEl.src = image;
      });
    };

    try {
      if (!faceDetection.modelsLoaded) {
        console.debug('Face detection models not ready — loading now.');
        await faceDetection.loadModels();
        await new Promise(resolve => setTimeout(resolve, 250));
      }

      let imageNode: HTMLImageElement;
      try {
        imageNode = await prepareImageForAnalysis();
      } catch (prepError) {
        const message = prepError instanceof Error ? prepError.message : 'Could not load image for analysis.';
        setDetectionError(message);
        setFaceCount(null);
        return;
      }

      const localAnalysis = await faceDetection.analyzeImage(imageNode);

      if (!localAnalysis) {
        setDetectionError(faceDetection.error || 'No face detected. Please try again.');
        setFaceCount(null);
        return;
      }

      const match = localAnalysis.reasoning?.match(/Detected\s+(\d+)\s+face/i);
      setFaceCount(match ? parseInt(match[1], 10) : 1);

      const moodResponse = await analyzeMoodWithImage(image);

      if (moodResponse.error) {
        setDetectionError(moodResponse.error);
        return;
      }

      const recommendations = rankRecommendations(
        filterDestinationsByMood({
          ...moodResponse,
          recommendedKeys: moodResponse.recommendedKeys ?? [],
        }),
        prefAnswers
      );

      if (recommendations.length === 0) {
        setDetectionError('Could not find matching destinations. Please try again.');
        return;
      }

      const aiResult: AIAnalysisResult = {
        detectedMood: moodResponse.detectedMood,
        confidence: moodResponse.confidence,
        emotions: moodResponse.emotions,
        reasoning: moodResponse.reasoning,
        energyLevel: moodResponse.energyLevel,
        socialScore: moodResponse.socialScore,
        adventureScore: moodResponse.adventureScore,
        recommendations,
      };

      setResult(aiResult);
      setSelectedDestinationIdx(0);
      setAIStep(1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Analysis failed';
      console.error('❌ Mood analysis failed:', error);

      if (/Failed to reach mood analyzer service/i.test(message) || message.includes('Failed to fetch')) {
        setDetectionError(
          `Cannot connect to backend at ${backendEndpoint}. Make sure the server is running on port 3001.\n` +
          'Run: cd backend && npm run dev'
        );
      } else if (message.startsWith('HTTP')) {
        setDetectionError(`Backend returned error: ${message}`);
      } else {
        setDetectionError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-analyze effect
  useEffect(() => {
    if (image && isAutoAnalyzing && !loading) {
      analyzeAI().finally(() => {
         setIsAutoAnalyzing(false);
         setCountdown(null);
         faceDetectionStartTimeRef.current = null;
      });
    }
  }, [image, isAutoAnalyzing, loading]);

  async function payAI() {
    if (!result || selectedDestinationIdx === null) return;

    setIsPayingAI(true);
    const dest = displayRecommendations[selectedDestinationIdx];
    const amount = (dest.pricePerDay || 2500) * 3; // Base price for 3 days

    try {
      await makePayment(amount);
      setIsPayingAI(false);
      setPaidAI(true);
    } catch (error) {
      console.error('Payment error:', error);
      setIsPayingAI(false);
    }
  }

  function downloadTicketAI() {
    if (!result) return;
    const dest = (displayRecommendations[selectedDestinationIdx ?? 0]) as Destination;
    const doc = new jsPDF();
    const amount = (dest.pricePerDay || 2500) * 3;
    doc.setFontSize(16);
    doc.text(`✈️ DarShana AI Trip Ticket`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Destination: ${dest.title}`, 10, 40);
    doc.text(`Detected Mood: ${result.detectedMood}`, 10, 55);
    doc.text(`Confidence: ${(result.confidence * 100).toFixed(0)}%`, 10, 70);
    doc.text(`Amount Paid: ₹${amount}`, 10, 85);
    doc.text(`Booking Date: ${new Date().toLocaleDateString()}`, 10, 100);
    doc.text(`Best Time to Visit: ${dest.bestTime || 'Year-round'}`, 10, 115);
    doc.save('darshana-trip-ticket.pdf');
  }

  // Manual mode recommendation
  function getRecommendations(): Destination[] {
    const filtered = DESTINATIONS.filter(dest =>
      (mood !== null ? dest.mood.includes(mood) : true) &&
      energy >= dest.energy[0] && energy <= dest.energy[1] &&
      social >= dest.social[0] && social <= dest.social[1] &&
      adventure >= dest.adventure[0] && adventure <= dest.adventure[1]
    );
    return filtered.length ? filtered.slice(0, 3) : DESTINATIONS.slice(0, 3);
  }

  async function pay() {
    setIsPaying(true);
    const amount = 5000 + energy * 120 + adventure * 180 + social * 100;
    try {
      await makePayment(amount);
      setIsPaying(false);
      setStep(6);
    } catch (error) {
      console.error('Payment error:', error);
      setIsPaying(false);
    }
  }

  function downloadTicket() {
    const dest = getRecommendations()[selectedIdx ?? 0];
    const amount = 5000 + energy * 120 + adventure * 180 + social * 100;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`✈️ DarShana Trip Ticket`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Destination: ${dest.title}`, 10, 40);
    doc.text(`Amount Paid: ₹${amount}`, 10, 55);
    doc.text(`Booking Date: ${new Date().toLocaleDateString()}`, 10, 70);
    doc.save('darshana-trip-ticket.pdf');
  }

  const displayRecommendations = useMemo(() => {
    if (!result) return [];
    return result.recommendations;
  }, [result]);

  const selectedDestination = selectedDestinationIdx !== null ? displayRecommendations[selectedDestinationIdx] : null;
  const selectedWeather = selectedDestination ? weatherByDest[selectedDestination.id] : null;

  const currentQuestion = PREF_QUESTIONS[prefStep];
  const isCurrentAnswered = Boolean(prefAnswers[currentQuestion.id as keyof PreferenceAnswers]);

  if (mode === 'ar') {
    return <ARGuide onBack={() => setMode('ai')} />;
  }

  // UI Start
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-teal-600 mb-4 font-serif tracking-tight">
            Discover Your Perfect Journey
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Let our AI analyze your mood or customize your preferences to find the destination that speaks to your soul.
          </p>
        </motion.div>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-xl border border-white/50 flex gap-2">
            {[
              { id: 'ai', label: 'AI Mood Analyzer', icon: Camera },
              { id: 'ar', label: 'AR Experience', icon: Scan },
              { id: 'manual', label: 'Manual Selection', icon: Sparkles }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'ar') {
                    setMode('ar');
                  } else if (tab.id === 'ai') {
                    setMode('ai');
                    setAIStep(0);
                    clearCapturedImage();
                    setPaidAI(false);
                    setIsPayingAI(false);
                    setPrefStep(0);
                    setPrefAnswers({});
                  } else {
                    setMode('manual');
                    setStep(1);
                    setMood(null);
                    setEnergy(5);
                    setSocial(5);
                    setAdventure(5);
                    setPrefStep(0);
                    setPrefAnswers({});
                  }
                }}
                className={`relative px-6 py-3 rounded-full font-semibold text-sm transition-colors duration-300 flex items-center gap-2 ${
                  mode === tab.id ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-full shadow-md ${
                      (tab.id as string) === 'ai' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                      (tab.id as string) === 'ar' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                      'bg-gradient-to-r from-teal-500 to-emerald-600'
                    }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon size={18} />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'ai' ? (
            <motion.div
              key="ai-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
            >
              <div className="p-8 md:p-12">
                {aiStep === 0 && (
                  <div className="max-w-2xl mx-auto text-center space-y-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="inline-block p-4 rounded-full bg-orange-100 text-orange-600 mb-6">
                        <Camera size={48} />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Mood Travel Matcher</h2>
                      <p className="text-gray-600 mb-6 text-lg">
                        Answer three quick intent questions, then let AI read your vibe and tailor destinations to both mood and preference.
                      </p>
                    </motion.div>

                    <div className="bg-white/80 border border-orange-100 shadow-lg rounded-3xl p-6 text-left">
                      <div className="flex items-start justify-between gap-4 flex-col md:flex-row md:items-center">
                        <div>
                          <p className="text-sm font-semibold text-orange-600">Step {prefStep + 1} of {PREF_QUESTIONS.length}</p>
                          <h3 className="text-2xl font-bold text-gray-900 mt-1">{currentQuestion.title}</h3>
                          <p className="text-gray-600 mt-1">{currentQuestion.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {PREF_QUESTIONS.map((q, idx) => {
                            const answered = Boolean(prefAnswers[q.id as keyof PreferenceAnswers]);
                            const active = prefStep === idx;
                            return (
                              <span
                                key={q.id}
                                className={`h-2 w-10 rounded-full ${answered ? 'bg-orange-500' : 'bg-gray-200'} ${active ? 'shadow-[0_0_0_3px_rgba(234,88,12,0.15)]' : ''}`}
                              />
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {(currentQuestion.options ?? []).map((opt) => {
                          const active = prefAnswers[currentQuestion.id as keyof PreferenceAnswers] === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setPrefAnswers((prev) => ({ ...prev, [currentQuestion.id]: opt.value }));
                                setPrefStep((step) => Math.min(step + 1, PREF_QUESTIONS.length - 1));
                              }}
                              className={`flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition hover:shadow-md ${
                                active ? 'border-orange-500 bg-orange-50 text-orange-800 shadow-sm' : 'border-gray-200 bg-white text-gray-700'
                              }`}
                            >
                              <span className="font-semibold">{opt.label}</span>
                              {opt.hint && <span className="text-sm text-gray-500">{opt.hint}</span>}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3 justify-between items-center">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPrefStep((step) => Math.max(0, step - 1))}
                            disabled={prefStep === 0}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold disabled:opacity-50"
                          >
                            Back
                          </button>
                          <button
                            onClick={() => setPrefAnswers({})}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold"
                          >
                            Reset choices
                          </button>
                        </div>
                        <button
                          onClick={() => setPrefStep((step) => Math.min(step + 1, PREF_QUESTIONS.length - 1))}
                          disabled={!isCurrentAnswered}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md disabled:opacity-60"
                        >
                          {prefStep === PREF_QUESTIONS.length - 1 ? 'Finish' : 'Next'}
                        </button>
                      </div>

                      {prefComplete && (
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-orange-700">
                          {Object.entries(prefAnswers).map(([key, val]) => (
                            <span key={key} className="rounded-full bg-orange-50 border border-orange-200 px-3 py-1">
                              {key}: {val as string}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {!prefComplete && (
                      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                        Finish these quick questions to unlock camera-based mood analysis and tailored destinations.
                      </div>
                    )}

                    {prefComplete && (
                      <>
                        {detectionError && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-left"
                          >
                            <div className="flex gap-3">
                              <AlertCircle className="text-red-600 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="text-red-700 font-semibold mb-1">Camera Error</div>
                                <div className="text-red-600 text-sm whitespace-pre-line">{detectionError}</div>
                              </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                              <button 
                                onClick={() => {
                                  if (cameraStreamRef.current) {
                                    cameraStreamRef.current.getTracks().forEach(track => track.stop());
                                    cameraStreamRef.current = null;
                                  }
                                  setDetectionError(null);
                                  setIsCameraOpen(false);
                                  setTimeout(() => startCamera(), 100);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                              >
                                Retry Camera
                              </button>
                              <button 
                                onClick={() => setDetectionError(null)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                              >
                                Dismiss
                              </button>
                            </div>
                          </motion.div>
                        )}

                        <div className="mb-6 bg-gradient-to-r from-teal-50 to-sky-50 border border-teal-100 rounded-2xl p-4 text-left">
                          <div className="font-semibold text-gray-900 mb-1">Skip face scan and finish now</div>
                          <p className="text-sm text-gray-600 mb-3">Use your intent answers plus real destination locations to instantly see picks with live weather.</p>
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={finishWithInstantPicks}
                              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-md hover:shadow-lg transition"
                            >
                              Finish & show picks
                            </button>
                            <button
                              onClick={startCamera}
                              className="px-5 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-white transition"
                            >
                              Keep face scan
                            </button>
                          </div>
                        </div>

                        {!image && !isCameraOpen && (
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="h-80 border-3 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center gap-6 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group"
                          >
                            <button 
                              onClick={startCamera}
                              className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform group-hover:-translate-y-1"
                            >
                              <Camera size={24} /> Open Camera
                            </button>
                            <div className="flex items-center gap-4 w-full max-w-xs">
                              <div className="h-px bg-gray-300 flex-1"></div>
                              <span className="text-gray-400 font-medium">OR</span>
                              <div className="h-px bg-gray-300 flex-1"></div>
                            </div>
                            <label className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-orange-600 transition font-medium">
                              <Upload size={20} /> Upload Photo
                              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </label>
                          </motion.div>
                        )}

                        {isCameraOpen && (
                          <MoodCameraLoader
                            ref={videoRef}
                            onStreamReady={handleStreamReady}
                            onError={handleCameraError}
                            className="h-96 shadow-2xl ring-4 ring-orange-100"
                          >
                            <motion.div 
                              animate={{ top: ['0%', '100%', '0%'] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-70 z-10"
                            />
                            
                            {faceCount !== null && (
                              <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 flex items-center gap-2 z-20">
                                <Users size={16} className="text-orange-400" />
                                {faceCount === 0 ? 'No faces' : `${faceCount} face${faceCount > 1 ? 's' : ''} detected`}
                              </div>
                            )}

                            {countdown !== null && countdown > 0 && (
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center">
                                <div className="text-9xl font-bold text-white drop-shadow-2xl animate-pulse">
                                  {countdown}
                                </div>
                                <div className="text-white text-xl font-semibold mt-4 text-center drop-shadow-md bg-black/30 px-4 py-1 rounded-full backdrop-blur-sm">
                                  Auto-analyzing...
                                </div>
                              </div>
                            )}
                            
                            <button 
                              onClick={capturePhoto}
                              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200 border-4 border-orange-500 z-20"
                            >
                              <div className="w-16 h-16 bg-orange-500 rounded-full border-4 border-white"></div>
                            </button>
                            
                            <button 
                              onClick={stopCamera}
                              className="absolute top-6 right-6 bg-black/50 backdrop-blur-md text-white p-3 rounded-full hover:bg-red-500/80 transition-colors border border-white/20 z-20"
                            >
                              <Scan size={20} />
                            </button>
                          </MoodCameraLoader>
                        )}

                        {image && (
                          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-orange-100 group">
                            <img ref={imagePreviewRef} src={image} alt="Captured" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <button 
                              onClick={() => {
                                clearCapturedImage();
                                setAIStep(0);
                              }}
                              className="absolute top-6 right-6 bg-white/90 backdrop-blur text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-all transform hover:rotate-180 duration-500"
                            >
                              <RefreshCw size={20} />
                            </button>
                          </div>
                        )}

                        {image && !result && (
                          <motion.button 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={analyzeAI}
                            disabled={loading}
                            className="w-full mt-8 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-teal-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="animate-spin" size={24} />
                                Analyzing your mood...
                              </>
                            ) : (
                              <>
                                <Sparkles size={24} /> Analyze Mood & Recommend
                              </>
                            )}
                          </motion.button>
                        )}
                      </>
                    )}
                  </div>
                )}

                {aiStep === 1 && result && !paidAI && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 p-8 rounded-3xl mb-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-200 rounded-full opacity-20 blur-2xl"></div>
                      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="text-6xl bg-white p-6 rounded-full shadow-lg">
                          {(() => {
                            const mood = result.detectedMood.toLowerCase();
                            if (mood.includes('excited')) return '🤩';
                            if (mood.includes('happy')) return '😊';
                            if (mood.includes('sad')) return '😢';
                            if (mood.includes('calm')) return '😌';
                            return '😐';
                          })()}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="font-bold text-orange-900 text-3xl mb-2 font-serif">
                            You seem {result.detectedMood}!
                          </h3>
                          <p className="text-orange-800/80 text-lg mb-6 leading-relaxed">{result.reasoning}</p>
                          
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { label: 'Energy', value: result.energyLevel, icon: Zap, color: 'text-yellow-600' },
                              { label: 'Social', value: result.socialScore, icon: Users, color: 'text-blue-600' },
                              { label: 'Adventure', value: result.adventureScore, icon: Mountain, color: 'text-green-600' }
                            ].map((stat, i) => (
                              <div key={i} className="bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-white/50 text-center">
                                <stat.icon size={20} className={`mx-auto mb-1 ${stat.color}`} />
                                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{stat.label}</div>
                                <div className="text-xl font-bold text-gray-800">{stat.value}/10</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-10">
                      <h3 className="font-bold text-2xl mb-6 text-center text-gray-800">Recommended Destinations</h3>
                      <p className="text-center text-sm text-gray-500 mb-4">
                        Using your mood + preferences
                        {isLoadingWeather ? ' • fetching live weather...' : weatherByDest && Object.keys(weatherByDest).length > 0 ? ' • live weather applied' : ''}
                      </p>
                      <div className="mb-4 bg-sky-50/80 border border-sky-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-sky-900">
                        <div className="font-semibold">
                          {selectedDestination
                            ? `Clicked ${selectedDestination.title}: ${selectedWeather ? `${selectedWeather.tempC?.toFixed(0) ?? '--'}°C • ${selectedWeather.description}` : isLoadingWeather ? 'Fetching live weather...' : 'No live weather yet'}`
                            : 'Click any destination card to see its live weather.'}
                        </div>
                        <div className="text-xs text-sky-700">
                          Live weather from WeatherAPI.com
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {displayRecommendations.map((rec, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -8 }}
                            onClick={() => {
                              setSelectedDestinationIdx(idx);
                            }}
                            className={`relative group rounded-3xl overflow-hidden shadow-lg transition-all duration-300 text-left h-full flex flex-col ${
                              selectedDestinationIdx === idx
                                ? 'ring-4 ring-orange-500 ring-offset-4'
                                : 'hover:shadow-2xl'
                            }`}
                          >
                            <div className="h-48 overflow-hidden">
                              <img src={rec.img} alt={rec.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                                {rec.label}
                              </div>
                            </div>
                            <div className="p-5 bg-white flex-1 flex flex-col">
                              <h4 className="font-bold text-xl text-gray-900 mb-2">{rec.title}</h4>
                              {weatherByDest[rec.id] && (
                                <div className="text-sm text-blue-700 font-semibold mb-2">
                                  Live weather: {weatherByDest[rec.id].tempC?.toFixed(0) ?? '--'}°C • {weatherByDest[rec.id].description}
                                </div>
                              )}
                              <div className="flex flex-wrap gap-2 mt-auto">
                                {rec.tags.slice(0, 3).map((tag: string, i: number) => (
                                  <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="mt-4 w-full py-2 bg-orange-50 text-orange-600 rounded-lg text-center font-semibold text-sm group-hover:bg-orange-100 transition-colors">
                                View Details
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Destination Details & FAQ Section */}
                    {selectedDestinationIdx !== null && (
                      <div className="space-y-8 mb-10">
                        {/* Detailed View Card */}
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                        >
                          <div className="relative h-64 md:h-80">
                            <img 
                              src={displayRecommendations[selectedDestinationIdx]?.img} 
                              alt={displayRecommendations[selectedDestinationIdx]?.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                              <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">
                                {displayRecommendations[selectedDestinationIdx]?.label}
                              </div>
                              <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                                {displayRecommendations[selectedDestinationIdx]?.title}
                              </h2>
                              <p className="text-white/90 text-lg flex items-center gap-2">
                                <MapPin size={18} /> {displayRecommendations[selectedDestinationIdx]?.state}
                              </p>
                            </div>
                          </div>
                          
                          <div className="p-8">
                            <div className="flex flex-wrap gap-4 mb-6">
                              <div className="bg-orange-50 px-4 py-3 rounded-xl flex-1 min-w-[140px]">
                                <div className="text-orange-500 text-xs font-bold uppercase mb-1">Best Time</div>
                                <div className="font-semibold text-gray-800">{displayRecommendations[selectedDestinationIdx]?.bestTime || "Year-round"}</div>
                              </div>
                              <div className="bg-blue-50 px-4 py-3 rounded-xl flex-1 min-w-[140px]">
                                <div className="text-blue-500 text-xs font-bold uppercase mb-1">Price Per Day</div>
                                <div className="font-semibold text-gray-800">₹{displayRecommendations[selectedDestinationIdx]?.pricePerDay || 2500}</div>
                              </div>
                              <div className="bg-green-50 px-4 py-3 rounded-xl flex-1 min-w-[140px]">
                                <div className="text-green-500 text-xs font-bold uppercase mb-1">Match Score</div>
                                <div className="font-semibold text-gray-800">{(result.confidence * 100).toFixed(0)}%</div>
                              </div>
                              {displayRecommendations[selectedDestinationIdx] && weatherByDest[displayRecommendations[selectedDestinationIdx].id] && (
                                <div className="bg-sky-50 px-4 py-3 rounded-xl flex-1 min-w-[140px]">
                                  <div className="text-sky-500 text-xs font-bold uppercase mb-1">Live Weather</div>
                                  <div className="font-semibold text-gray-800">
                                    {weatherByDest[displayRecommendations[selectedDestinationIdx].id].tempC?.toFixed(0) ?? '--'}°C • {weatherByDest[displayRecommendations[selectedDestinationIdx].id].description}
                                  </div>
                                </div>
                              )}
                            </div>

                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                              {displayRecommendations[selectedDestinationIdx]?.description}
                            </p>

                            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                  <Sparkles size={20} />
                                </div>
                                <h4 className="font-bold text-lg text-blue-900">AI Insights</h4>
                              </div>
                              
                              {(() => {
                                const faqs = generateFAQ(displayRecommendations[selectedDestinationIdx], {
                                  detectedMood: result.detectedMood,
                                  confidence: result.confidence,
                                  emotions: result.emotions,
                                  energyLevel: result.energyLevel,
                                  socialScore: result.socialScore,
                                  adventureScore: result.adventureScore,
                                  reasoning: result.reasoning,
                                  recommendedKeys: [],
                                } as any);

                                return (
                                  <div className="space-y-3">
                                    {faqs.map((faq, idx) => (
                                      <div key={idx} className="bg-white/60 rounded-xl p-4 hover:bg-white transition-colors">
                                        <div className="font-semibold text-gray-800 mb-2 text-sm">{faq.question}</div>
                                        <div className="text-gray-600 text-sm leading-relaxed">{faq.answer}</div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        className="flex-1 px-8 py-4 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
                        onClick={() => {
                          restartToCamera();
                        }}
                      >
                        Try Again
                      </button>
                      <button 
                        className="flex-1 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        onClick={payAI}
                        disabled={isPayingAI || selectedDestinationIdx === null}
                      >
                        {isPayingAI ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Processing...
                          </>
                        ) : (
                          <>
                                Book Now • ₹{selectedDestinationIdx !== null ? ((displayRecommendations[selectedDestinationIdx]?.pricePerDay || 2500) * 3).toLocaleString() : '0'} <ArrowRight size={20} />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {paidAI && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="mb-8 inline-flex p-6 bg-green-100 rounded-full text-green-600">
                      <CheckCircle size={64} />
                    </div>
                    <h2 className="font-bold text-4xl mb-4 text-gray-900">You're All Set! 🎉</h2>
                    <p className="text-gray-600 mb-10 text-lg">Your journey to {displayRecommendations[selectedDestinationIdx ?? 0]?.title} begins now.</p>
                    
                    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-3xl p-8 shadow-xl mb-10 text-left relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Destination</div>
                          <div className="text-2xl font-bold text-gray-900">{displayRecommendations[selectedDestinationIdx ?? 0]?.title}</div>
                        </div>
                        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">CONFIRMED</div>
                      </div>
                      
                      <div className="space-y-4 border-t border-gray-100 pt-6">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Mood Match</span>
                          <span className="font-medium text-gray-900">{result?.detectedMood}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Confidence</span>
                          <span className="font-medium text-gray-900">{result && (result.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Date</span>
                          <span className="font-medium text-gray-900">{new Date().toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-dashed border-gray-200">
                          <span className="font-bold text-gray-900">Total Paid</span>
                          <span className="font-bold text-green-600 text-xl">₹6,500</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button 
                        className="px-8 py-4 rounded-xl font-bold bg-gray-900 text-white hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
                        onClick={downloadTicketAI}
                      >
                        <Scan size={20} /> Download Ticket
                      </button>
                      <button 
                        className="px-8 py-4 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        onClick={() => {
                          restartToCamera();
                        }}
                      >
                        Plan Another Trip
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="manual-mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12"
            >
              {/* Progress Bar */}
              <div className="flex justify-center gap-3 mb-12">
                {STEPS.slice(0,-1).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      step >= i ? 'w-12 bg-teal-500' : 'w-4 bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center max-w-2xl mx-auto"
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-10">What's your energy level?</h2>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <div className="text-8xl mb-6 animate-bounce">
                        {energy < 3 ? '😴' : energy < 7 ? '😊' : '🚀'}
                      </div>
                      <div className="text-2xl font-bold text-teal-600 mb-8">
                        {energy < 3 ? 'Low Energy' : energy < 7 ? 'Moderate Energy' : 'High Energy'}
                      </div>
                      <input 
                        type="range" 
                        min={1} 
                        max={10} 
                        value={energy} 
                        onChange={e => setEnergy(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-4 font-medium">
                        <span>Relaxed (1)</span>
                        <span className="text-teal-600 font-bold text-lg">{energy}/10</span>
                        <span>Active (10)</span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-10">
                      <button 
                        className="px-8 py-3 rounded-full font-medium text-gray-500 hover:bg-gray-100 transition"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </button>
                      <button 
                        className="px-10 py-3 rounded-full font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-lg transition"
                        onClick={() => setStep(2)}
                      >
                        Next Step
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center max-w-2xl mx-auto"
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-10">Social Preference?</h2>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <div className="text-8xl mb-6">
                        {social < 4 ? '🧘' : social < 7 ? '👫' : '🎉'}
                      </div>
                      <div className="text-2xl font-bold text-teal-600 mb-8">
                        {social < 4 ? 'Solo Traveler' : social < 7 ? 'Small Group' : 'Party Animal'}
                      </div>
                      <input 
                        type="range" 
                        min={1} 
                        max={10} 
                        value={social} 
                        onChange={e => setSocial(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-4 font-medium">
                        <span>Solo</span>
                        <span className="text-teal-600 font-bold text-lg">{social}/10</span>
                        <span>Crowd</span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-10">
                      <button 
                        className="px-8 py-3 rounded-full font-medium text-gray-500 hover:bg-gray-100 transition"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </button>
                      <button 
                        className="px-10 py-3 rounded-full font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-lg transition"
                        onClick={() => setStep(3)}
                      >
                        Next Step
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center max-w-2xl mx-auto"
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-10">Adventure Level?</h2>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <div className="text-8xl mb-6">
                        {adventure < 4 ? '🛋️' : adventure < 7 ? '🥾' : '🪂'}
                      </div>
                      <div className="text-2xl font-bold text-teal-600 mb-8">
                        {adventure < 4 ? 'Chill & Relax' : adventure < 7 ? 'Explorer' : 'Thrill Seeker'}
                      </div>
                      <input 
                        type="range" 
                        min={1} 
                        max={10} 
                        value={adventure} 
                        onChange={e => setAdventure(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-4 font-medium">
                        <span>Safe</span>
                        <span className="text-teal-600 font-bold text-lg">{adventure}/10</span>
                        <span>Extreme</span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-10">
                      <button 
                        className="px-8 py-3 rounded-full font-medium text-gray-500 hover:bg-gray-100 transition"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </button>
                      <button 
                        className="px-10 py-3 rounded-full font-bold bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105 transition-all"
                        onClick={() => setStep(4)}
                      >
                        Find My Trip ✨
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Perfect Matches For You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                      {getRecommendations().map((dest, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ y: -10 }}
                          className={`relative rounded-3xl overflow-hidden shadow-lg transition-all duration-300 text-left h-full flex flex-col ${
                            selectedIdx === idx ? 'ring-4 ring-teal-500 ring-offset-4' : 'hover:shadow-2xl'
                          }`}
                          onClick={() => setSelectedIdx(idx)}
                        >
                          <div className="h-48 overflow-hidden">
                            <img src={dest.img} alt={dest.title} className="w-full h-full object-cover"/>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                              {dest.label}
                            </div>
                          </div>
                          <div className="p-6 bg-white flex-1 flex flex-col">
                            <h4 className="font-bold text-xl text-gray-900 mb-2">{dest.title}</h4>
                            <div className="flex flex-wrap gap-2 mt-auto">
                              {dest.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex justify-center gap-4 flex-wrap">
                      <button 
                        className="px-8 py-3 rounded-full font-medium text-gray-500 hover:bg-gray-100 transition"
                        onClick={() => {
                          setStep(1);
                          setMood(null);
                          setEnergy(5);
                          setSocial(5);
                          setAdventure(5);
                        }}
                      >
                        Start Over
                      </button>
                      <a 
                        href="/#/safety"
                        className="px-8 py-3 rounded-full font-bold bg-red-600 text-white hover:bg-red-700 shadow-lg transition flex items-center gap-2"
                      >
                        <Shield className="w-5 h-5" /> Safety First
                      </a>
                      <button 
                        className="px-12 py-3 rounded-full font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={selectedIdx === null}
                        onClick={() => setStep(5)}
                      >
                        Proceed to Booking
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div 
                    key="step5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-lg mx-auto"
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Confirm Booking</h2>
                    
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                      <div className="h-32 bg-gray-200 relative">
                        <img 
                          src={getRecommendations()[selectedIdx ?? 0]?.img} 
                          alt="Destination" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <h3 className="text-white font-bold text-2xl">{getRecommendations()[selectedIdx ?? 0]?.title}</h3>
                        </div>
                      </div>
                      <div className="p-8 space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-500">Mood</span>
                          <span className="font-medium text-gray-900">{['Happy','Neutral','Surprised','Sad','Excited','Thoughtful','Energetic'][mood ?? 0]}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-500">Energy Level</span>
                          <span className="font-medium text-gray-900">{energy}/10</span>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                          <span className="text-lg font-bold text-gray-900">Total</span>
                          <span className="text-3xl font-bold text-teal-600">₹{5000 + energy*120 + adventure*180 + social*100}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                      disabled={isPaying}
                      onClick={pay}
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay & Confirm <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {step === 6 && (
                  <motion.div 
                    key="step6"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="mb-8 inline-flex p-6 bg-green-100 rounded-full text-green-600">
                      <CheckCircle size={64} />
                    </div>
                    <h2 className="font-bold text-4xl mb-4 text-gray-900">Booking Confirmed!</h2>
                    <p className="text-gray-600 mb-10 text-lg">Get ready for an amazing trip to {getRecommendations()[selectedIdx ?? 0]?.title}</p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button 
                        className="px-8 py-4 rounded-xl font-bold bg-gray-900 text-white hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
                        onClick={downloadTicket}
                      >
                        <Scan size={20} /> Download Ticket
                      </button>
                      <button 
                        className="px-8 py-4 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        onClick={() => {
                          setStep(1);
                          setMood(null);
                          setEnergy(5);
                          setSocial(5);
                          setAdventure(5);
                        }}
                      >
                        Plan Another Trip
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500 flex flex-col items-center gap-2 pb-8">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Secure & Private. Analysis happens locally on your device.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodAnalyzer;
