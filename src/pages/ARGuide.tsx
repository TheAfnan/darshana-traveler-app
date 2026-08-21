import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    } catch (e1) {
      // Fallback
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
    setCapturedImage(null);
    setIsScanning(true);
    setTimeout(() => {
      setMonumentResult({
        ...curated,
        isLiveAI: false
      });
      setIsScanning(false);
    }, 350);
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

  const activePhoto = capturedImage || monumentResult?.imageUrl || CURATED_MONUMENTS_DATA['taj mahal'].imageUrl;

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Page Header (Clean Modern SaaS Heading) */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-xs font-semibold shadow-2xs">
            <Landmark size={13} className="text-amber-700" />
            <span>Heritage Lens & Monument Identifier</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Monument Scan & History Guide
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
            Point your camera or upload a photo of any Indian landmark to discover its architecture, history, and key insights.
          </p>
        </div>

        {/* VIEWPORT & SCANNER CONTAINER */}
        {!monumentResult ? (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4">
              
              {/* Camera Video Viewport */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-stone-800 shadow-inner aspect-[4/3] sm:aspect-[16/9] flex items-center justify-center">
                
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

                {/* Viewfinder Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-medium text-white shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{cameraActive ? 'Camera Active' : 'Ready to Scan'}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-200 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                      1.0X
                    </div>
                  </div>

                  {/* Center Reticle */}
                  <div className="relative w-48 sm:w-64 h-48 sm:h-64 mx-auto border border-white/30 rounded-2xl flex items-center justify-center">
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-white rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-white rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-white rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-white rounded-br-lg" />

                    {isScanning && (
                      <motion.div
                        animate={{ y: [-70, 70, -70] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                      />
                    )}

                    {!isScanning && (
                      <span className="text-xs text-white font-medium px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full border border-white/10 shadow-sm">
                        Align Landmark
                      </span>
                    )}
                  </div>

                  <div className="text-center">
                    <span className="text-xs text-slate-200 bg-slate-900/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 inline-block shadow-md">
                      {isScanning ? 'Analyzing architecture...' : 'Point at monument facade or dome'}
                    </span>
                  </div>
                </div>

                {/* Camera Fallback State */}
                {cameraError && !capturedImage && (
                  <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3 z-20">
                    <div className="w-12 h-12 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center">
                      <Camera size={22} className="text-amber-500" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <h3 className="text-sm font-bold text-white">Camera Access</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
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
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Landmark size={14} className="text-amber-600" />
                  Popular Landmark Demos
                </span>
                <span className="text-[11px] text-slate-400">Instant Preview</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Taj Mahal', key: 'taj mahal' },
                  { name: 'Bara Imambara', key: 'bara imambara' },
                  { name: 'Hawa Mahal', key: 'hawa mahal' },
                  { name: 'Qutub Minar', key: 'qutub minar' },
                  { name: 'Charminar', key: 'charminar' },
                  { name: 'Gateway of India', key: 'gateway of india' }
                ].map((demo) => (
                  <button
                    key={demo.key}
                    onClick={() => handleSelectCuratedPreset(demo.key)}
                    className="px-3 py-1.5 bg-stone-50 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 hover:border-amber-300 rounded-xl text-xs text-slate-700 font-medium transition cursor-pointer"
                  >
                    {demo.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* RESULT VIEW: CLEAN MODERN SAAS MONUMENT CARD */
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

              {/* Tab Contents (High Contrast & Clean Typography) */}
              <div className="p-6 sm:p-8 space-y-4">
                {activeTab === 'history' && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Cultural Heritage
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed font-normal">
                      {monumentResult.history}
                    </p>
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
