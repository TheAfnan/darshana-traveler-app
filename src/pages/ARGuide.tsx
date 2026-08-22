import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  MapPin, 
  Landmark, 
  History, 
  Compass, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
  Globe,
  ExternalLink,
  Key,
  AlertCircle,
  CheckCircle2,
  X,
  Search
} from 'lucide-react';
import { analyzeMonumentPhoto, CURATED_MONUMENTS_DATA } from '../services/monumentScanApi';
import type { MonumentResult } from '../types/arGuide';

export const ARGuide: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [monumentResult, setMonumentResult] = useState<MonumentResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'facts' | 'nearby'>('history');

  // Gemini API Key Modal State
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Search filter for curated fallback
  const [monumentSearch, setMonumentSearch] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('darshana_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
    setApiKeyInput(savedKey);
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      localStorage.setItem('darshana_gemini_api_key', apiKeyInput.trim());
      setApiKeySaved(true);
      setTimeout(() => {
        setApiKeySaved(false);
        setShowApiKeyModal(false);
      }, 1200);
    }
  };

  const hasApiKey = Boolean(
    localStorage.getItem('darshana_gemini_api_key')?.trim() || 
    import.meta.env.VITE_GEMINI_API_KEY?.trim()
  );

  // Multi-tier camera initialization
  const startCamera = async () => {
    setIsRequestingCamera(true);
    setCameraError(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera stream not supported in this browser. Use 'Take Photo' or 'Upload Photo' below.");
      setCameraActive(false);
      setIsRequestingCamera(false);
      return;
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      attachStream(mediaStream);
      return;
    } catch {
      // Fallback to basic constraint
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      attachStream(mediaStream);
      return;
    } catch (err: any) {
      let userMsg = "Camera access unavailable. Click 'Allow Camera' or upload a photo below.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        userMsg = "Camera permission was denied. Click 'Allow Camera' or snap a photo directly below.";
      }
      setCameraError(userMsg);
      setCameraActive(false);
      setIsRequestingCamera(false);
    }
  };

  const attachStream = (mediaStream: MediaStream) => {
    setStream(mediaStream);
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(() => {});
    }
    setCameraActive(true);
    setCameraError(null);
    setIsRequestingCamera(false);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleCaptureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
      runIdentification(dataUrl);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
      stopCamera();
      runIdentification(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const runIdentification = async (dataUrl: string) => {
    setIsScanning(true);
    try {
      const result = await analyzeMonumentPhoto(dataUrl);
      setMonumentResult(result);
    } catch {
      setMonumentResult({
        name: 'Could Not Identify Monument',
        location: 'India',
        era: 'Unknown',
        builtBy: 'Unknown',
        architectureStyle: 'Unidentified',
        history: 'We could not recognize this monument automatically. Please choose from our verified heritage list below.',
        funFacts: [],
        confidence: 'low',
        isLiveAI: false,
        isIdentified: false,
        errorReason: 'Recognition failed. Try a clearer angle.'
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectCuratedPreset = (key: string) => {
    const curated = CURATED_MONUMENTS_DATA[key.toLowerCase()];
    if (curated) {
      setCapturedImage(curated.imageUrl || null);
      setMonumentResult({
        ...curated,
        isLiveAI: false,
        isIdentified: true
      });
      stopCamera();
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setMonumentResult(null);
    startCamera();
  };

  const activePhoto = capturedImage || monumentResult?.imageUrl || CURATED_MONUMENTS_DATA['taj mahal'].imageUrl;

  const filteredPresets = Object.entries(CURATED_MONUMENTS_DATA).filter(([key, val]) => {
    if (!monumentSearch.trim()) return true;
    return val.name.toLowerCase().includes(monumentSearch.toLowerCase()) || 
           val.location.toLowerCase().includes(monumentSearch.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans pb-24">
      
      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 text-orange-700 rounded-xl">
                  <Key size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Gemini AI Vision Setup</h3>
              </div>
              <button onClick={() => setShowApiKeyModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your Google Gemini API key to enable live camera recognition for Indian monuments, palaces, and heritage architecture.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gemini API Key</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-orange-600"
                />
              </div>

              <div className="text-[11px] text-slate-500">
                <span>Get a free key from </span>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-orange-700 font-semibold underline inline-flex items-center gap-1">
                  <span>Google AI Studio</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              {apiKeySaved && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={15} />
                  <span>API Key saved successfully!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-3.5 py-2 border border-stone-200 text-xs font-semibold text-slate-600 rounded-xl hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                >
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Frame Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Banner */}
      <div className="bg-white border-b border-stone-200 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200/80 text-orange-800 rounded-full text-xs font-bold mb-2">
                <Sparkles size={13} className="text-orange-600" />
                <span>AI Vision & AR Heritage Scanner</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
                Identify Indian Monuments
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Point your phone camera at any historical monument to reveal architectural secrets, history, and verified Wikipedia encyclopedia insights.
              </p>
            </div>

            {/* AI Key Status Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-full text-xs font-semibold transition cursor-pointer shadow-2xs"
                title="Configure Gemini Vision API Key"
              >
                <Key size={12} className={hasApiKey ? 'text-emerald-600' : 'text-amber-600'} />
                <span>Vision AI Key</span>
                <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {!monumentResult ? (
          /* SCANNER / CAMERA VIEW */
          <div className="space-y-6">
            
            <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-7 shadow-xs space-y-5">
              
              {/* Viewfinder Frame */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-stone-300 shadow-inner">
                
                {/* Live Video Feed */}
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                />

                {/* Viewfinder Target Reticle */}
                {cameraActive && !isScanning && (
                  <div className="absolute inset-8 sm:inset-14 border-2 border-dashed border-white/60 rounded-2xl pointer-events-none flex flex-col justify-between p-4">
                    <div className="flex justify-between">
                      <span className="w-4 h-4 border-t-2 border-l-2 border-orange-400" />
                      <span className="w-4 h-4 border-t-2 border-r-2 border-orange-400" />
                    </div>
                    <p className="text-center text-xs text-white/90 font-medium bg-slate-900/60 backdrop-blur-xs py-1 px-3 rounded-full self-center">
                      Align monument within frame
                    </p>
                    <div className="flex justify-between">
                      <span className="w-4 h-4 border-b-2 border-l-2 border-orange-400" />
                      <span className="w-4 h-4 border-b-2 border-r-2 border-orange-400" />
                    </div>
                  </div>
                )}

                {/* Scanning Animation */}
                {isScanning && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3 z-20">
                    <div className="w-16 h-16 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin flex items-center justify-center text-orange-500">
                      <Sparkles size={24} className="animate-pulse" />
                    </div>
                    <div className="space-y-1 text-white">
                      <p className="font-bold text-base">Analyzing Monument Architecture...</p>
                      <p className="text-xs text-slate-300">Matching with Gemini 1.5 Flash Vision & Wikipedia Database</p>
                    </div>
                  </div>
                )}

                {/* Camera Inactive Fallback Prompt */}
                {!cameraActive && !isScanning && (
                  <div className="p-6 text-center space-y-4 max-w-sm">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center mx-auto text-2xl">
                      <Camera size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white">Camera Access</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {cameraError || "Enable camera to identify monuments in real-time, or upload a photo."}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        onClick={startCamera}
                        disabled={isRequestingCamera}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <RefreshCw size={13} className={isRequestingCamera ? 'animate-spin' : ''} />
                        <span>{isRequestingCamera ? 'Connecting...' : 'Allow Camera'}</span>
                      </button>
                      <button
                        onClick={() => nativeCameraInputRef.current?.click()}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera size={13} className="text-amber-400" />
                        <span>Take Photo</span>
                      </button>
                      <button
                        onClick={() => galleryInputRef.current?.click()}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload size={13} />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {cameraActive && (
                  <button
                    onClick={handleCaptureFrame}
                    disabled={isScanning}
                    className="w-full sm:w-auto px-7 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera size={15} />
                    <span>{isScanning ? 'Identifying...' : 'Capture & Identify'}</span>
                  </button>
                )}

                {/* Native Mobile Camera Snap */}
                <input
                  ref={nativeCameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => nativeCameraInputRef.current?.click()}
                  disabled={isScanning}
                  className="px-5 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Camera size={15} className="text-amber-700" />
                  <span>Snap with Phone Camera</span>
                </button>

                {/* Upload From Gallery */}
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={isScanning}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-slate-700 font-medium text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ImageIcon size={15} className="text-stone-500" />
                  <span>Choose Photo</span>
                </button>
              </div>

            </div>

            {/* QUICK PRESET DEMO CARD */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Landmark size={14} className="text-amber-600" />
                  Verified Indian Heritage Presets
                </span>
                <span className="text-[11px] text-slate-400">Click any landmark for instant 360° guide</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {Object.keys(CURATED_MONUMENTS_DATA).map((key) => {
                  const mon = CURATED_MONUMENTS_DATA[key];
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectCuratedPreset(key)}
                      className="px-3 py-1.5 bg-stone-50 hover:bg-orange-50 hover:text-orange-900 border border-stone-200 hover:border-orange-300 rounded-xl text-xs text-slate-700 font-medium transition cursor-pointer"
                    >
                      {mon.name}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        ) : monumentResult.isIdentified === false ? (
          
          /* UNIDENTIFIED STATE (HONEST & HELPFUL - NO RANDOM GUESSES) */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs text-center space-y-5">
              
              {/* Thumbnail of what was captured */}
              {capturedImage && (
                <div className="w-36 h-36 rounded-2xl overflow-hidden mx-auto border-2 border-stone-200 shadow-xs">
                  <img src={capturedImage} alt="Scanned Photo" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-1.5 max-w-md mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[11px] font-bold">
                  <AlertCircle size={13} className="text-amber-600" />
                  <span>Monument Not Confidently Recognized</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                  Could Not Identify This Monument
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {monumentResult.errorReason || "The lighting, distance, or angle was unclear. You can try capturing another photo or search our verified heritage list below."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <RefreshCw size={13} />
                  <span>Try Another Photo</span>
                </button>
                
                {!hasApiKey && (
                  <button
                    onClick={() => setShowApiKeyModal(true)}
                    className="px-4 py-2.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Key size={13} />
                    <span>Set Free Gemini API Key</span>
                  </button>
                )}
              </div>
            </div>

            {/* Manual Selection Search from Verified Database */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Select From Verified Heritage Directory</h3>
                  <p className="text-xs text-slate-500">Pick the landmark manually to view full historical architectural facts.</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={monumentSearch}
                    onChange={(e) => setMonumentSearch(e.target.value)}
                    placeholder="Search monument or city..."
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredPresets.map(([key, mon]) => (
                  <div
                    key={key}
                    onClick={() => handleSelectCuratedPreset(key)}
                    className="p-3.5 bg-stone-50 hover:bg-orange-50/70 border border-stone-200 hover:border-orange-300 rounded-2xl transition cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={mon.imageUrl}
                      alt={mon.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-slate-900 truncate">{mon.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{mon.location}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        ) : (
          
          /* SUCCESSFUL RECOGNITION VIEW */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              
              {/* Destination Editorial Showcase Header */}
              <div className="relative h-64 sm:h-80 bg-slate-900 overflow-hidden text-white">
                <img
                  src={activePhoto}
                  alt={monumentResult.name}
                  className="w-full h-full object-cover opacity-85 filter brightness-95"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 sm:p-8 flex flex-col justify-end">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm">
                      <MapPin size={12} className="text-amber-400" />
                      {monumentResult.location}
                    </span>

                    {/* Live AI vs Curated Badge */}
                    <span className={`px-3 py-1 backdrop-blur-md border text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm ${
                      monumentResult.isLiveAI
                        ? 'bg-emerald-600/80 border-emerald-400/40 text-white'
                        : 'bg-stone-800/80 border-white/20 text-slate-200'
                    }`}>
                      <Sparkles size={11} className={monumentResult.isLiveAI ? 'text-amber-300' : 'text-slate-300'} />
                      <span>{monumentResult.isLiveAI ? 'Live AI Vision Identified' : 'Verified Heritage Archive'}</span>
                    </span>

                    {monumentResult.wikipediaUrl && (
                      <a
                        href={monumentResult.wikipediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Globe size={12} className="text-cyan-300" />
                        <span>Wikipedia Verified</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-1 tracking-tight">
                    {monumentResult.name}
                  </h2>
                </div>
              </div>

              {/* Architecture Quick Facts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 sm:p-6 bg-stone-50/80 border-b border-stone-200 text-xs">
                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Historic Era</span>
                  <p className="font-semibold text-slate-800">{monumentResult.era}</p>
                </div>
                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Commissioned By</span>
                  <p className="font-semibold text-slate-800">{monumentResult.builtBy}</p>
                </div>
                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Architectural Style</span>
                  <p className="font-semibold text-slate-800">{monumentResult.architectureStyle}</p>
                </div>
              </div>

              {/* HIGH-CONTRAST SAAS SEGMENTED TABS */}
              <div className="px-6 pt-5">
                <div className="flex bg-stone-100 p-1 rounded-xl gap-1 border border-stone-200/80">
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'history'
                        ? 'bg-white text-slate-900 shadow-xs border border-stone-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <BookOpen size={14} className={activeTab === 'history' ? 'text-amber-600' : 'text-slate-400'} />
                    <span>Historical Overview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('facts')}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'facts'
                        ? 'bg-white text-slate-900 shadow-xs border border-stone-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <History size={14} className={activeTab === 'facts' ? 'text-amber-600' : 'text-slate-400'} />
                    <span>Key Insights</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('nearby')}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'nearby'
                        ? 'bg-white text-slate-900 shadow-xs border border-stone-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <Compass size={14} className={activeTab === 'nearby' ? 'text-amber-600' : 'text-slate-400'} />
                    <span>Nearby Sights</span>
                  </button>
                </div>
              </div>

              {/* Tab Contents */}
              <div className="p-6 sm:p-8 space-y-4">
                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Cultural Heritage Overview
                      </h4>
                      <p className="text-slate-700 text-sm leading-relaxed font-normal">
                        {monumentResult.history}
                      </p>
                    </div>

                    {monumentResult.wikipediaExtract && (
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Globe size={13} className="text-cyan-700" />
                            <span>Verified Wikipedia Record</span>
                          </span>
                          {monumentResult.wikipediaUrl && (
                            <a
                              href={monumentResult.wikipediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-800 hover:text-cyan-950 font-bold inline-flex items-center gap-1"
                            >
                              <span>Full Article</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                        <p className="text-slate-600 leading-relaxed font-normal text-[11px]">
                          {monumentResult.wikipediaExtract}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'facts' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Architecture & Design Highlights
                    </h4>
                    <ul className="space-y-2.5">
                      {monumentResult.funFacts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
                          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed font-medium">{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'nearby' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Explore Around Location
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {(monumentResult.nearbySpots || ['Heritage Walk Promenade', 'Old Bazaar Lane', 'Archaeological Museum']).map((spot, idx) => (
                        <div key={idx} className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 flex items-center gap-2">
                          <MapPin size={13} className="text-amber-600 shrink-0" />
                          <span className="font-semibold">{spot}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clean Action Bar */}
              <div className="bg-stone-50 p-5 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-stone-100 border border-stone-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <RefreshCw size={14} /> Scan Another Landmark
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    to="/travelhub"
                    className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Explore in Travel Hub</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </div>

    </div>
  );
};

export default ARGuide;
