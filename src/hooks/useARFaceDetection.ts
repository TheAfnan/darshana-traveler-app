/**
 * useARFaceDetection Hook
 * Extends standard face detection with AR-specific positioning and tracking
 */

import { useState, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import type { FacePosition } from '../types/arGuide';
import { useFaceDetection } from './useFaceDetection';

export interface UseARFaceDetectionReturn {
  loadingModels: boolean;
  modelsLoaded: boolean;
  facePosition: FacePosition | null;
  expressions: faceapi.FaceExpressions | null;
  detectARFace: (video: HTMLVideoElement) => Promise<void>;
  loadModels: () => Promise<void>;
}

export function useARFaceDetection(): UseARFaceDetectionReturn {
  const { loadModels, loadingModels, modelsLoaded } = useFaceDetection();
  const [facePosition, setFacePosition] = useState<FacePosition | null>(null);
  const [expressions, setExpressions] = useState<faceapi.FaceExpressions | null>(null);
  const lastDetectionTime = useRef<number>(0);

  const detectARFace = useCallback(async (video: HTMLVideoElement) => {
    if (!modelsLoaded || video.paused || video.ended) return;

    // Throttle detection to ~30fps for performance
    const now = Date.now();
    if (now - lastDetectionTime.current < 33) return;
    lastDetectionTime.current = now;

    try {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
        .withFaceExpressions();

      if (detection) {
        const { x, y, width, height } = detection.detection.box;
        
        // Smooth transition could be added here
        setFacePosition({
          x,
          y,
          width,
          height,
          centerX: x + width / 2,
          centerY: y + height / 2,
        });
        setExpressions(detection.expressions);
      } else {
        setFacePosition(null);
        setExpressions(null);
      }
    } catch (err) {
      console.error('AR Face detection error:', err);
    }
  }, [modelsLoaded]);

  return {
    loadingModels,
    modelsLoaded,
    facePosition,
    expressions,
    detectARFace,
    loadModels
  };
}
