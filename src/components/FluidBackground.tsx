'use client';

import React, { useEffect, useRef } from 'react';

/**
 * FluidBackground Component
 * 
 * An interactive fluid simulation background using the fluid-sim.js library.
 * Creates dynamic, flowing visual effects that respond to interaction.
 */

export interface FluidBackgroundProps {
  /** Hex color for the fluid (e.g., "#1b6ce5") */
  colorHex?: string;
  /** Glow size parameter (controls splat radius) */
  glowSize?: number;
}

// Global script loading state
let globalScriptLoaded = false;
let globalScriptPromise: Promise<void> | null = null;
const loadFluidScript = (): Promise<void> => {
  if (globalScriptLoaded) {
    return Promise.resolve();
  }
  if (globalScriptPromise) {
    return globalScriptPromise;
  }
  globalScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src="https://drive.groove.design/tico/fluid-sim.js"]');
    if (existingScript) {
      globalScriptLoaded = true;
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://drive.groove.design/tico/fluid-sim.js';
    script.async = true;
    script.onload = () => {
      globalScriptLoaded = true;
      resolve();
    };
    script.onerror = () => {
      globalScriptPromise = null;
      reject(new Error('Failed to load fluid-sim.js'));
    };
    document.body.appendChild(script);
  });
  return globalScriptPromise;
};
export const FluidBackground: React.FC<FluidBackgroundProps> = ({
  colorHex = '#41ae96',
  glowSize = 0.1125
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const configIdRef = useRef<string>(`fluid-${Math.random().toString(36).substr(2, 9)}`);
  useEffect(() => {
    const configId = configIdRef.current;

    // Configure the fluid simulation for this instance
    (window as any)[configId] = {
      GUI: false,
      SIM_RESOLUTION: 32,
      DYE_RESOLUTION: 512,
      CAPTURE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 5.000000000000006,
      VELOCITY_DISSIPATION: 3.6604361370716507,
      PRESSURE: 0,
      PRESSURE_ITERATIONS: 1,
      CURL: 0,
      SPLAT_RADIUS: glowSize,
      SPLAT_FORCE: 1000,
      SHADING: true,
      COLORFUL: false,
      COLOR_UPDATE_SPEED: 0,
      PAUSED: false,
      BACK_COLOR: {
        r: 255,
        g: 255,
        b: 255
      },
      TRANSPARENT: true,
      BLOOM: false,
      BLOOM_ITERATIONS: 8,
      BLOOM_RESOLUTION: 256,
      BLOOM_INTENSITY: 0.8,
      BLOOM_THRESHOLD: 0.6,
      BLOOM_SOFT_KNEE: 0.7,
      SUNRAYS: false,
      SUNRAYS_RESOLUTION: 196,
      SUNRAYS_WEIGHT: 1,
      CUSTOM_COLOR: colorHex !== "",
      COLOR_RANGE: [colorHex, colorHex]
    };

    // Set as global config temporarily for initialization
    (window as any).customFluidConfig = (window as any)[configId];

    // Load the fluid simulation script
    loadFluidScript().catch(console.error);
    return () => {
      // Cleanup
      delete (window as any)[configId];
    };
  }, [colorHex, glowSize]);
  return <div ref={containerRef} className="glow-background w-full h-full" style={{
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'auto',
    zIndex: 0
  }} data-color-hex={colorHex} data-glow-size={glowSize}>
    <style>
      {`
        .glow-background canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          display: block;
          border-radius: inherit;
        }
      `}
    </style>
  </div>;
};
export default FluidBackground;