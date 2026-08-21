import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  Sparkles, 
  MapPin, 
  Landmark, 
  History, 
  Compass, 
  Info, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight,
  AlertCircle,
  Image as ImageIcon
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
  const [dismissNotice, setDismissNotice] = useState(false);

  // Multi-tier resilient camera initializer (supports mobile rear, mobile front, laptop/desktop webcams)
  const startCamera = async () => {
    setIsRequestingCamera(true);
    setCameraError(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Live camera stream is not supported in this browser. Use 'Take Photo' or 'Upload Photo' below.");
      setCameraActive(false);
      setIsRequestingCamera(false);
      return;
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    // Attempt 1: Ideal Rear Environment Camera (High-res on Mobile)
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
    } catch (e1) {
      console.warn("Attempt 1 (environment ideal) failed, trying fallback...", e1);
    }

    // Attempt 2: Basic environment string constraint
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      attachStream(mediaStream);
      return;
    } catch (e2) {
      console.warn("Attempt 2 (facingMode environment) failed, trying generic video...", e2);
    }

    // Attempt 3: Generic video device (works on laptops/desktops with webcam & all mobile devices)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      attachStream(mediaStream);
      return;
    } catch (err: any) {
      console.warn("All live camera attempts failed:", err);
      let userMsg = "Camera access unavailable. Tap 'Enable Camera' or use 'Take Photo' below.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        userMsg = "Camera permission was denied in your browser. Tap 'Allow Camera' to grant access, or snap a photo directly below.";
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

  // Capture frame from live video
  const handleCaptureFrame = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    setCapturedImage(dataUrl);
    stopCamera();
    await processMonumentScan(dataUrl);
  };

  // Upload or native camera file handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
      stopCamera();
      await processMonumentScan(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Quick preset test
  const handleSelectCuratedPreset = async (presetKey: string) => {
    const curated = CURATED_MONUMENTS_DATA[presetKey];
    if (!curated) return;
    stopCamera();
    setIsScanning(true);
    setTimeout(() => {
      setMonumentResult({
        ...curated,
        isLiveAI: false
      });
      setIsScanning(false);
    }, 600);
  };

  // Scan & analyze
  const processMonumentScan = async (imageDataUrl: string) => {
    setIsScanning(true);
    setMonumentResult(null);
    try {
      const result = await analyzeMonumentPhoto(imageDataUrl);
      setMonumentResult(result);
    } catch (err) {
      console.error("Monument scan failed:", err);
      setMonumentResult(CURATED_MONUMENTS_DATA['taj mahal']);
    } finally {
      setIsScanning(false);
    }
  };

  // Reset scanner
  const handleReset = () => {
    setCapturedImage(null);
    setMonumentResult(null);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header Banner */}
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-xs font-semibold">
          <Sparkles size={13} className="text-amber-400" />
          <span>AR Heritage Lens & Monument Identifier</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
          Monument Scan & History Guide
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Point your camera or upload a photo of any temple, palace, or Indian historical landmark to uncover its architecture, centuries of history, and hidden secrets.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* VIEWPORT & SCANNER CONTAINER */}
        {!monumentResult ? (
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl aspect-[4/3] sm:aspect-[16/9] flex items-center justify-center">
              
              {/* Live Video Feed */}
              {cameraActive && !capturedImage && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {/* Captured Image Preview */}
              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="Captured Landmark"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Hidden Canvas for capture */}
              <canvas ref={canvasRef} className="hidden" />

              {/* AR HUD Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                {/* Top HUD bar */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-medium text-amber-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{cameraActive ? 'AR Scanner Active' : 'Camera Ready'}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                    LENS 1.0X
                  </div>
                </div>

                {/* Center Reticle / Scanning Frame */}
                <div className="relative w-48 sm:w-72 h-48 sm:h-72 mx-auto border-2 border-dashed border-amber-400/40 rounded-3xl flex items-center justify-center">
                  {/* Corner brackets */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />

                  {/* Scanning sweep beam */}
                  {isScanning && (
                    <motion.div
                      animate={{ y: [-90, 90, -90] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b]"
                    />
                  )}

                  {!isScanning && (
                    <span className="text-[11px] text-amber-200/80 font-medium px-2.5 py-1 bg-slate-950/70 rounded-md">
                      Align Monument in Frame
                    </span>
                  )}
                </div>

                {/* Bottom HUD bar */}
                <div className="text-center">
                  <span className="text-xs text-slate-300 bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 inline-block shadow-md">
                    {isScanning ? '🧠 AI analyzing architecture & history...' : 'Point at facade or dome & tap capture'}
                  </span>
                </div>
              </div>

              {/* Camera Access Fallback Box */}
              {cameraError && !capturedImage && (
                <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <Camera size={28} className="text-amber-400" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h3 className="text-base font-bold text-white">Enable Camera Access</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={startCamera}
                      disabled={isRequestingCamera}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <RefreshCw size={14} className={isRequestingCamera ? 'animate-spin' : ''} />
                      <span>{isRequestingCamera ? 'Requesting...' : 'Allow Camera'}</span>
                    </button>
                    <button
                      onClick={() => nativeCameraInputRef.current?.click()}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Camera size={14} className="text-amber-400" />
                      <span>Take Photo</span>
                    </button>
                    <button
                      onClick={() => galleryInputRef.current?.click()}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
                    >
                      <Upload size={14} />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SCANNER CONTROLS */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {cameraActive && (
                <button
                  onClick={handleCaptureFrame}
                  disabled={isScanning}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Camera size={18} className="text-slate-950" />
                  <span>{isScanning ? 'Identifying Monument...' : 'Capture & Identify'}</span>
                </button>
              )}

              {/* Direct Phone Camera Snap (Mobile Native Camera) */}
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
                className="flex-1 sm:flex-initial px-6 py-3.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera size={16} />
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
                className="flex-1 sm:flex-initial px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ImageIcon size={16} className="text-slate-400" />
                <span>Upload From Gallery</span>
              </button>
            </div>

            {/* QUICK PRESET DEMO SELECTOR */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Landmark size={14} className="text-amber-400" />
                  Try Instant Landmark Demo:
                </span>
                <span className="text-[11px] text-slate-500">Tap to inspect archive</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Taj Mahal (Agra)', key: 'taj mahal' },
                  { name: 'Bara Imambara (Lucknow)', key: 'bara imambara' },
                  { name: 'Hawa Mahal (Jaipur)', key: 'hawa mahal' },
                  { name: 'Qutub Minar (Delhi)', key: 'qutub minar' },
                  { name: 'Charminar (Hyderabad)', key: 'charminar' },
                  { name: 'Gateway of India (Mumbai)', key: 'gateway of india' }
                ].map((demo) => (
                  <button
                    key={demo.key}
                    onClick={() => handleSelectCuratedPreset(demo.key)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-amber-500/20 hover:border-amber-400/50 border border-slate-700/80 rounded-xl text-xs text-slate-300 hover:text-amber-200 transition cursor-pointer"
                  >
                    {demo.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* RESULT VIEW: MONUMENT HISTORY & ARCHITECTURE CARD */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              
              {/* Header Hero Image & Identification Badge */}
              <div className="relative h-64 sm:h-80 bg-slate-950 overflow-hidden">
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt={monumentResult.name}
                    className="w-full h-full object-cover filter brightness-90"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-900/40 via-slate-900 to-slate-950 flex items-center justify-center p-6 text-center">
                    <Landmark size={64} className="text-amber-400/40" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-6 sm:p-8 flex flex-col justify-end">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${
                      monumentResult.isLiveAI 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      <CheckCircle2 size={12} />
                      {monumentResult.isLiveAI ? '⚡ Live AI Vision Match' : '📚 Curated Heritage Archive'}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] font-medium rounded-full flex items-center gap-1">
                      <MapPin size={11} className="text-amber-400" />
                      {monumentResult.location}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                    {monumentResult.name}
                  </h2>
                </div>
              </div>

              {/* AI Config Notice (when using curated demo/fallback) */}
              {!monumentResult.isLiveAI && !dismissNotice && (
                <div className="mx-6 sm:mx-8 mt-4 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-200/90 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <Info size={16} className="text-amber-400 shrink-0" />
                    <span>Live AI scanning isn't configured yet — showing a curated example instead.</span>
                  </div>
                  <button 
                    onClick={() => setDismissNotice(true)}
                    className="text-amber-400/70 hover:text-amber-200 text-xs px-2 py-0.5 rounded cursor-pointer transition"
                    title="Dismiss notice"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Architecture Quick Facts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-6 bg-slate-950/60 border-b border-slate-800/80 text-xs">
                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Historic Era</span>
                  <p className="font-semibold text-slate-200">{monumentResult.era}</p>
                </div>
                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Commissioned By</span>
                  <p className="font-semibold text-slate-200">{monumentResult.builtBy}</p>
                </div>
                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Architectural Style</span>
                  <p className="font-semibold text-slate-200">{monumentResult.architectureStyle}</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-800 px-6 pt-2">
                <button
                  onClick={() => setActiveTab('history')}
                  className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'history'
                      ? 'border-amber-400 text-amber-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen size={14} /> Historical Narrative
                </button>
                <button
                  onClick={() => setActiveTab('facts')}
                  className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'facts'
                      ? 'border-amber-400 text-amber-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles size={14} /> Did You Know?
                </button>
                <button
                  onClick={() => setActiveTab('nearby')}
                  className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'nearby'
                      ? 'border-amber-400 text-amber-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Compass size={14} /> Nearby Sights
                </button>
              </div>

              {/* Tab Contents */}
              <div className="p-6 sm:p-8 space-y-4">
                {activeTab === 'history' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <History size={16} className="text-amber-400" />
                      Cultural Story & Significance
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed font-normal">
                      {monumentResult.history}
                    </p>
                  </div>
                )}

                {activeTab === 'facts' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-400" />
                      Architectural & Acoustic Trivia
                    </h4>
                    <ul className="space-y-2.5">
                      {monumentResult.funFacts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'nearby' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Compass size={16} className="text-amber-400" />
                      Nearby Heritage Attractions
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {(monumentResult.nearbySpots || ['Heritage Walk Promenade', 'Old Bazaar Lane', 'Archaeological Museum']).map((spot, idx) => (
                        <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2">
                          <MapPin size={13} className="text-amber-400 shrink-0" />
                          <span className="font-medium">{spot}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="bg-slate-950 p-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={14} /> Scan Another Landmark
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    to="/travelhub"
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 text-xs font-black rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
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
