'use client';

import React, { useRef, useEffect, useCallback } from 'react';

const TOTAL_FRAMES = 300;
const FRAME_PATH = '/transformation-frames/frame_';

/**
 * Generates the URL for a given frame index (0-based → 1-based filename).
 */
function getFrameUrl(index: number): string {
  const num = Math.min(Math.max(index + 1, 1), TOTAL_FRAMES);
  return `${FRAME_PATH}${String(num).padStart(3, '0')}.webp`;
}

interface TransformationSequenceProps {
  scrollProgress: React.MutableRefObject<number>;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TRANSFORMATION SEQUENCE — SCROLL-SCRUBBED CANVAS IMAGE SEQUENCE
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders 300 WebP frames on a full-viewport <canvas>, scrubbed by scroll
 * progress (0.0 → 1.0). Uses progressive preloading for fast initial paint,
 * Retina DPR scaling, and responsive cover-fit centering.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function TransformationSequence({
  scrollProgress,
}: TransformationSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null),
  );
  const lastDrawnFrame = useRef(-1);
  const rafId = useRef<number>(0);

  /**
   * Draw a single frame onto the canvas with cover-fit scaling (like
   * object-fit: cover) so the athlete stays centered and fills the viewport.
   */
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find the nearest loaded frame if the exact one isn't ready yet
    let img = framesRef.current[frameIndex];
    if (!img) {
      // Search nearby loaded frames (prefer forward, then backward)
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (frameIndex + offset < TOTAL_FRAMES && framesRef.current[frameIndex + offset]) {
          img = framesRef.current[frameIndex + offset];
          break;
        }
        if (frameIndex - offset >= 0 && framesRef.current[frameIndex - offset]) {
          img = framesRef.current[frameIndex - offset];
          break;
        }
      }
    }

    if (!img) return;

    const dpr = window.devicePixelRatio || 1;
    const displayW = canvas.clientWidth;
    const displayH = canvas.clientHeight;

    // Set canvas internal resolution to match DPR for Retina sharpness
    if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
      ctx.scale(dpr, dpr);
    }

    // Clear
    ctx.clearRect(0, 0, displayW, displayH);

    // Cover-fit: scale so image covers the canvas, then center
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = displayW / displayH;

    let drawW: number, drawH: number, dx: number, dy: number;

    if (canvasAspect > imgAspect) {
      // Canvas is wider than image → fit to width
      drawW = displayW;
      drawH = displayW / imgAspect;
      dx = 0;
      dy = (displayH - drawH) / 2;
    } else {
      // Canvas is taller than image → fit to height
      drawH = displayH;
      drawW = displayH * imgAspect;
      dx = (displayW - drawW) / 2;
      dy = 0;
    }

    ctx.drawImage(img, dx, dy, drawW, drawH);
  }, []);

  /**
   * Animation loop: continuously reads scrollProgress ref and draws the
   * corresponding frame. Only redraws when the frame index actually changes.
   */
  useEffect(() => {
    const tick = () => {
      const progress = scrollProgress.current;
      // Map progress (0→1) to frame index (0→299)
      const frameIndex = Math.min(
        Math.floor(progress * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1,
      );

      if (frameIndex !== lastDrawnFrame.current) {
        lastDrawnFrame.current = frameIndex;
        drawFrame(frameIndex);
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [scrollProgress, drawFrame]);

  /**
   * Progressive image preloading strategy:
   *  1. Load frame 0 immediately (first paint)
   *  2. Load 7 milestone key-frames for instant jumps
   *  3. Load remaining frames in order
   */
  useEffect(() => {
    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (framesRef.current[index]) {
          resolve();
          return;
        }
        const img = new Image();
        img.src = getFrameUrl(index);
        img.onload = () => {
          framesRef.current[index] = img;
          // If this is the very first frame, draw it immediately
          if (index === 0 && lastDrawnFrame.current === -1) {
            lastDrawnFrame.current = 0;
            drawFrame(0);
          }
          resolve();
        };
        img.onerror = () => resolve(); // Skip broken frames gracefully
      });
    };

    const preload = async () => {
      // Phase 1: First frame for instant display
      await loadImage(0);

      // Phase 2: Key milestone frames (evenly distributed through the sequence)
      const milestoneFrames = [0, 47, 99, 149, 199, 249, 299];
      await Promise.all(milestoneFrames.map(loadImage));

      // Phase 3: Load all remaining frames in sequential order
      // (batch in groups of 10 to avoid overwhelming the browser)
      const remaining = Array.from({ length: TOTAL_FRAMES }, (_, i) => i).filter(
        (i) => !framesRef.current[i],
      );

      for (let batch = 0; batch < remaining.length; batch += 10) {
        const chunk = remaining.slice(batch, batch + 10);
        await Promise.all(chunk.map(loadImage));
      }
    };

    preload();
  }, [drawFrame]);

  /**
   * Handle window resize: redraw the current frame at new dimensions.
   */
  useEffect(() => {
    const handleResize = () => {
      if (lastDrawnFrame.current >= 0) {
        // Force canvas size recalculation by resetting dimensions
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = 0;
          canvas.height = 0;
        }
        drawFrame(lastDrawnFrame.current);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}
