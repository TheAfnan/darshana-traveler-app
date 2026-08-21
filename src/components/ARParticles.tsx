import React, { useEffect, useRef } from 'react';

interface ARParticlesProps {
  facePosition: { centerX: number; centerY: number } | null;
  width: number;
  height: number;
}

export const ARParticles: React.FC<ARParticlesProps> = ({ facePosition, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; size: number; life: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const createParticle = (x: number, y: number) => ({
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      life: 1.0,
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn particles near face if detected
      if (facePosition) {
        if (Math.random() > 0.5) { // Spawn rate
          particlesRef.current.push(createParticle(facePosition.centerX, facePosition.centerY));
        }
      }

      // Update and draw particles
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 245, 255, ${p.life})`; // Neon Cyan
        ctx.fill();

        // Remove dead particles
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        }
      });

      // Connect particles with lines if close
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 50) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 245, 255, ${0.2 * p1.life})`;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [facePosition, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 pointer-events-none z-20"
    />
  );
};
