import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, MapPin, CreditCard, Download, RefreshCw, X, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import { useARFaceDetection } from '../hooks/useARFaceDetection';
import { analyzeARScene } from '../services/arGuideApi';
import { ARParticles } from '../components/ARParticles';
import { ARCard } from '../components/ARCard';
import type { ARResult, ARDestination } from '../types/arGuide';

// --- Types & Constants ---
type ARStep = 'camera' | 'scanning' | 'overlay' | 'booking' | 'ticket';

const MOCK_PAYMENT_DELAY = 2000;

interface ARGuideProps {
  onBack?: () => void;
}

// --- Main Component ---
const ARGuide: React.FC<ARGuideProps> = ({ onBack }) => {
  // State
  const [step, setStep] = useState<ARStep>('camera');
  const [arResult, setArResult] = useState<ARResult | null>(null);
  const [selectedDest, setSelectedDest] = useState<ARDestination | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { 
    loadModels, 
    modelsLoaded, 
    facePosition, 
    detectARFace 
  } = useARFaceDetection();

  // --- Initialization ---
  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
    } catch (err) {
      console.error('Camera Error:', err);
      setError('Camera access denied. Please enable permissions.');
    }
  }, []);

  useEffect(() => {
    if (step === 'camera') {
      startCamera();
    }
    return () => {
      // Cleanup stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step, startCamera]);

  // --- AR Loop ---
  useEffect(() => {
    let animationId: number;
    
    const loop = async () => {
      if (videoRef.current && modelsLoaded && step === 'camera') {
        await detectARFace(videoRef.current);
      }
      animationId = requestAnimationFrame(loop);
    };
    
    loop();
    return () => cancelAnimationFrame(animationId);
  }, [modelsLoaded, step, detectARFace]);

  // --- Actions ---
  const handleScan = async () => {
    if (!videoRef.current) return;
    
    setStep('scanning');
    setIsProcessing(true);

    // Capture frame
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    try {
      // Simulate scanning delay for effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = await analyzeARScene(imageData);
      setArResult(result);
      setStep('overlay');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
      setStep('camera');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBooking = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, MOCK_PAYMENT_DELAY));
      setStep('ticket');
    } catch (err) {
      setError('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTicket = () => {
    if (!selectedDest || !arResult) return;
    
    const doc = new jsPDF();
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setTextColor(0, 245, 255);
    doc.setFontSize(22);
    doc.text('DarShana AR Ticket', 105, 20, { align: 'center' });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(`Destination: ${selectedDest.title}`, 20, 50);
    doc.text(`Mood: ${arResult.detectedMood}`, 20, 65);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 80);
    doc.text(`Amount Paid: ₹${selectedDest.pricePerDay ? selectedDest.pricePerDay * 3 : 15000}`, 20, 95);
    
    doc.save('darshana-ar-ticket.pdf');
  };

  // --- Render Helpers ---
  const renderOverlay = () => {
    if (!arResult) return null;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          {arResult.recommendations.map((dest, idx) => {
            let position: 'left' | 'center' | 'right' = 'center';
            if (idx === 0) position = 'center';
            if (idx === 1) position = 'left';
            if (idx === 2) position = 'right';
            
            return (
              <ARCard 
                key={dest.id}
                destination={dest}
                position={position}
                onSelect={(d) => {
                  setSelectedDest(d);
                  setStep('booking');
                }}
              />
            );
          })}
        </div>
        
        {/* Mood HUD */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-cyan-500/30 px-6 py-2 rounded-full flex items-center gap-4">
          <div className="text-cyan-400 font-bold text-lg">{arResult.detectedMood}</div>
          <div className="h-4 w-[1px] bg-gray-500" />
          <div className="flex gap-3 text-xs text-gray-300">
            <span>⚡ {arResult.energyLevel}/10</span>
            <span>🤝 {arResult.socialScore}/10</span>
            <span>🏔️ {arResult.adventureScore}/10</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 w-full h-screen bg-[#0a0a0a] overflow-hidden font-inter text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900/50 to-black z-0" />

      {/* Camera Feed */}
      <video 
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-10 opacity-80"
        playsInline
        muted
      />

      {/* AR Particles */}
      <ARParticles 
        facePosition={facePosition} 
        width={containerRef.current?.clientWidth || window.innerWidth} 
        height={containerRef.current?.clientHeight || window.innerHeight} 
      />

      {/* Scanning Overlay */}
      <AnimatePresence>
        {step === 'scanning' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <Scan className="w-24 h-24 text-cyan-400 animate-pulse" />
            <p className="mt-4 text-cyan-300 font-mono text-lg tracking-widest">ANALYZING BIOMETRICS...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main UI Layer */}
      <div className="relative z-50 w-full h-full flex flex-col">
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="p-2 bg-black/40 rounded-full hover:bg-black/60 border border-white/10 transition-colors">
                <ArrowLeft size={20} className="text-white" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#00f5ff]" />
              <span className="font-mono text-cyan-500 text-sm">AR SYSTEM ONLINE</span>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="p-2 bg-black/40 rounded-full hover:bg-black/60 border border-white/10">
            <RefreshCw size={20} className="text-white/70" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative">
          {step === 'camera' && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
              <p className="mb-6 text-white/80 text-lg font-light">Align your face to begin analysis</p>
              <button 
                onClick={handleScan}
                className="group relative px-8 py-4 bg-cyan-500/10 backdrop-blur-md border border-cyan-500 rounded-full overflow-hidden transition-all hover:bg-cyan-500/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,245,255,0.4)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                <span className="relative flex items-center gap-3 text-cyan-300 font-bold tracking-wider">
                  <Scan size={24} /> INITIATE SCAN
                </span>
              </button>
            </div>
          )}

          {step === 'overlay' && renderOverlay()}

          {step === 'booking' && selectedDest && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              className="absolute bottom-0 w-full bg-black/80 backdrop-blur-xl border-t border-cyan-500/30 rounded-t-3xl p-8"
            >
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                      {selectedDest.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 text-gray-400">
                      <MapPin size={16} />
                      <span>{selectedDest.state || 'India'}</span>
                    </div>
                  </div>
                  <button onClick={() => setStep('overlay')} className="p-2 hover:bg-white/10 rounded-full">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-gray-400 text-sm mb-1">Total Price</div>
                    <div className="text-2xl font-bold text-white">₹{selectedDest.pricePerDay ? selectedDest.pricePerDay * 3 : 15000}</div>
                    <div className="text-xs text-gray-500">For 3 Days</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-gray-400 text-sm mb-1">Match Score</div>
                    <div className="text-2xl font-bold text-cyan-400">{selectedDest.matchScore}%</div>
                    <div className="text-xs text-gray-500">Based on mood</div>
                  </div>
                </div>

                <button 
                  onClick={handleBooking}
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-lg shadow-lg shadow-cyan-900/50 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <RefreshCw className="animate-spin" />
                  ) : (
                    <>
                      <CreditCard size={20} /> CONFIRM BOOKING
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'ticket' && selectedDest && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md bg-gradient-to-b from-slate-900 to-black border border-cyan-500/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,245,255,0.2)]"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                    <Download className="text-green-400" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                  <p className="text-gray-400">Your AR journey begins now.</p>
                </div>

                <div className="space-y-4 mb-8 border-t border-b border-white/10 py-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Destination</span>
                    <span className="font-bold text-white">{selectedDest.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date</span>
                    <span className="font-bold text-white">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reference</span>
                    <span className="font-mono text-cyan-400">#AR-{Math.floor(Math.random()*10000)}</span>
                  </div>
                </div>

                <button 
                  onClick={downloadTicket}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mb-3"
                >
                  <Download size={18} /> Download Ticket PDF
                </button>
                
                <button 
                  onClick={() => setStep('camera')}
                  className="w-full py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Start New Scan
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Error Modal */}
      {error && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl max-w-sm text-center">
            <h3 className="text-red-400 font-bold text-xl mb-2">System Error</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="px-6 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARGuide;
