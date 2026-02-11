"use client";

import dynamic from "next/dynamic";
import { prefersReducedMotion } from "utils/gsap";

const Scene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), { ssr: false });

const R3FCanvas = dynamic(
  () =>
    import("@react-three/fiber").then((mod) => {
      const { Canvas } = mod;
      return function CanvasWrapper() {
        return (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
            dpr={[1, 1.5]}
          >
            <Scene />
          </Canvas>
        );
      };
    }),
  { ssr: false }
);

export function HeroCanvas() {
  if (typeof window !== "undefined" && prefersReducedMotion()) return null;

  return (
    <div
      className="absolute inset-0 z-0 w-full h-screen overflow-hidden pointer-events-none"
      aria-hidden
    >
      <R3FCanvas />
    </div>
  );
}
