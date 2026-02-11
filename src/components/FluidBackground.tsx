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
export const FluidBackground: React.FC<FluidBackgroundProps> = ({
  colorHex = '#1b6ce5',
  glowSize = 0.1125
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  useEffect(() => {
    // Configure the fluid simulation
    (window as any).customFluidConfig = {
      GUI: false,
      // Set to true for debugging
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

    // Load the fluid simulation script if not already loaded
    if (!scriptLoadedRef.current) {
      const script = document.createElement('script');
      script.src = 'https://drive.groove.design/tico/fluid-sim.js';
      script.async = true;
      document.body.appendChild(script);
      scriptLoadedRef.current = true;
      return () => {
        // Cleanup: remove script on unmount
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        scriptLoadedRef.current = false;
      };
    }
  }, [colorHex, glowSize]);
  return <div ref={containerRef} className="glow-background w-full h-full" style={{
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
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