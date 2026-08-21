import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Loader2, CameraOff } from 'lucide-react';

interface MoodCameraLoaderProps {
  onStreamReady?: (stream: MediaStream) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

const MoodCameraLoader = forwardRef<HTMLVideoElement, MoodCameraLoaderProps>(({ 
  onStreamReady, 
  onError,
  className = "",
  children
}, ref) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useImperativeHandle(ref, () => internalVideoRef.current as HTMLVideoElement);

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      // Reset state
      setIsLoading(true);
      setError(null);

      // Check for secure context
      if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        const msg = "Camera requires a secure context (HTTPS or localhost)";
        setError(msg);
        setIsLoading(false);
        onError?.(msg);
        return;
      }

      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const msg = "Browser does not support camera access";
        setError(msg);
        setIsLoading(false);
        onError?.(msg);
        return;
      }

      try {
        const constraints: MediaStreamConstraints = {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 60 },
            facingMode: "user"
          },
          audio: false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        
        if (internalVideoRef.current) {
          internalVideoRef.current.srcObject = stream;
          // Wait for video to be ready to play
          internalVideoRef.current.onloadedmetadata = () => {
            if (mounted) {
              internalVideoRef.current?.play().catch(e => console.error("Play error:", e));
              setIsLoading(false);
              onStreamReady?.(stream);
            }
          };
        }
      } catch (err: any) {
        if (!mounted) return;
        
        let msg = "Failed to access camera";
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          msg = "Camera permission denied. Please allow access.";
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          msg = "No camera device found.";
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          msg = "Camera is in use by another application.";
        }
        
        setError(msg);
        setIsLoading(false);
        onError?.(msg);
      }
    };

    initCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onStreamReady, onError]);

  return (
    <div className={`relative bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center ${className}`}>
      {/* Video Element */}
      <video 
        ref={internalVideoRef}
        autoPlay 
        playsInline 
        muted
        className={`w-full h-full object-cover transform scale-x-[-1] ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />

      {/* Loading State */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/80 backdrop-blur-sm text-white z-10">
          <Loader2 className="w-10 h-10 animate-spin text-teal-500 mb-3" />
          <p className="text-sm font-medium text-stone-300">Initializing camera...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900 text-white z-20 p-6 text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <CameraOff className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">Camera Error</h3>
          <p className="text-stone-400 text-sm max-w-xs">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Children Overlays */}
      {!isLoading && !error && children}
    </div>
  );
});

MoodCameraLoader.displayName = 'MoodCameraLoader';

export default MoodCameraLoader;
