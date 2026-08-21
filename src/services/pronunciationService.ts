/*
 * Pronunciation assessment over WebSocket.
 * Configure via env:
 * - VITE_PRONUNCIATION_WS_URL (default: ws://ise-api-sg.xf-yun.com/v2/ise)
 * - VITE_PRONUNCIATION_API_KEY (optional) used as token query param
 */

export interface PronunciationScores {
  overall?: number;
  accuracy?: number;
  fluency?: number;
  completeness?: number;
  details?: unknown;
}

export interface PronunciationCallbacks {
  onOpen?: () => void;
  onResult?: (scores: PronunciationScores) => void;
  onError?: (err: unknown) => void;
  onClose?: (code?: number, reason?: string) => void;
}

const WS_URL = (import.meta.env.VITE_PRONUNCIATION_WS_URL as string) || 'ws://ise-api-sg.xf-yun.com/v2/ise';
const API_KEY = (import.meta.env.VITE_PRONUNCIATION_API_KEY as string) || '';

export function startPronunciationAssessment(
  refText: string,
  language: string,
  audioStream: AsyncIterable<ArrayBuffer>,
  callbacks: PronunciationCallbacks = {}
): Promise<void> {
  return new Promise((resolve) => {
    const url = API_KEY ? `${WS_URL}?token=${encodeURIComponent(API_KEY)}` : WS_URL;
    const ws = new WebSocket(url);

    const safeClose = (code?: number, reason?: string) => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(code, reason);
      }
    };

    ws.onopen = async () => {
      callbacks.onOpen?.();
      try {
        // Send initial config frame; adjust payload per provider spec.
        ws.send(
          JSON.stringify({
            cmd: 'start',
            params: {
              language,
              refText,
            },
          })
        );

        for await (const chunk of audioStream) {
          if (ws.readyState !== WebSocket.OPEN) break;
          ws.send(chunk);
        }

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ cmd: 'stop' }));
        }
      } catch (err) {
        callbacks.onError?.(err);
        safeClose();
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data?.result) {
          callbacks.onResult?.({
            overall: data.result.overall,
            accuracy: data.result.accuracy,
            fluency: data.result.fluency,
            completeness: data.result.completeness,
            details: data.result.details,
          });
        }
      } catch (err) {
        callbacks.onError?.(err);
      }
    };

    ws.onerror = (err) => {
      callbacks.onError?.(err);
      safeClose();
    };

    ws.onclose = (evt) => {
      callbacks.onClose?.(evt.code, evt.reason);
      resolve();
    };
  });
}
