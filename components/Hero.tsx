"use client";

import { useEffect, useRef } from "react";
import PolymathDecorations from "@/components/PolyMathDecorations";
import { Poly } from "next/font/google";

/* ─── Vitruvian / Anatomy SVG with PCB overlay ─── */
function AnatomyFigure() {
  return (
    <svg
      className="w-full max-w-[420px] opacity-40 dark:opacity-40"
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: "breathe 6s ease-in-out infinite" }}
    >
      {/* Da Vinci circles */}
      <circle
        cx="200"
        cy="220"
        r="160"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.5"
      />
      <circle
        cx="200"
        cy="220"
        r="140"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* Inner square */}
      <rect
        x="80"
        y="60"
        width="240"
        height="320"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.5"
      />

      {/* Head */}
      <circle
        cx="200"
        cy="100"
        r="24"
        stroke="var(--anatomy-stroke-strong)"
        strokeWidth="0.8"
      />
      {/* Brain detail */}
      <path
        d="M185 92 Q200 85 215 92"
        stroke="var(--accent)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.25"
      />
      <path
        d="M188 96 Q200 90 212 96"
        stroke="var(--accent)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.18"
      />

      {/* Spine */}
      <line
        x1="200"
        y1="124"
        x2="200"
        y2="280"
        stroke="var(--anatomy-stroke-strong)"
        strokeWidth="0.8"
      />

      {/* Ribcage */}
      <path
        d="M170 160 Q200 150 230 160"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.5"
        fill="none"
      />
      <path
        d="M172 172 Q200 163 228 172"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M175 184 Q200 176 225 184"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.6"
      />

      {/* Shoulders & Arms */}
      <line
        x1="200"
        y1="140"
        x2="145"
        y2="150"
        stroke="var(--anatomy-stroke-strong)"
        strokeWidth="0.8"
      />
      <line
        x1="200"
        y1="140"
        x2="255"
        y2="150"
        stroke="var(--anatomy-stroke-strong)"
        strokeWidth="0.8"
      />
      <line
        x1="145"
        y1="150"
        x2="115"
        y2="230"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.8"
      />
      <line
        x1="255"
        y1="150"
        x2="285"
        y2="230"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.8"
      />
      <line
        x1="115"
        y1="230"
        x2="95"
        y2="310"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.6"
      />
      <line
        x1="285"
        y1="230"
        x2="305"
        y2="310"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.6"
      />

      {/* Pelvis */}
      <path
        d="M175 280 Q200 295 225 280"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.8"
        fill="none"
      />

      {/* Legs */}
      <line
        x1="185"
        y1="285"
        x2="170"
        y2="400"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.8"
      />
      <line
        x1="215"
        y1="285"
        x2="230"
        y2="400"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.8"
      />
      <line
        x1="170"
        y1="400"
        x2="165"
        y2="470"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.6"
      />
      <line
        x1="230"
        y1="400"
        x2="235"
        y2="470"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.6"
      />

      {/* Heart — red accent */}
      <circle
        cx="210"
        cy="170"
        r="8"
        stroke="var(--accent)"
        strokeWidth="0.8"
        fill="var(--accent-dim)"
        opacity="0.6"
      />
      <path
        d="M206 168 Q210 163 214 168 Q218 173 210 180 Q202 173 206 168Z"
        stroke="var(--accent)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.4"
      />

      {/* Circuit traces overlaid on body */}
      <line
        x1="210"
        y1="178"
        x2="210"
        y2="220"
        stroke="var(--accent)"
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0.2"
      />
      <line
        x1="210"
        y1="220"
        x2="250"
        y2="220"
        stroke="var(--accent)"
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0.15"
      />
      <circle cx="250" cy="220" r="2" fill="var(--accent)" opacity="0.2" />

      {/* PCB via points */}
      <circle
        cx="120"
        cy="300"
        r="3"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.5"
        fill="none"
      />
      <circle cx="120" cy="300" r="1" fill="var(--accent)" opacity="0.2" />
      <circle
        cx="280"
        cy="160"
        r="3"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.5"
        fill="none"
      />
      <circle cx="280" cy="160" r="1" fill="var(--accent)" opacity="0.2" />

      {/* Da Vinci measurement lines */}
      <line
        x1="60"
        y1="76"
        x2="60"
        y2="460"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <line
        x1="56"
        y1="76"
        x2="64"
        y2="76"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.5"
      />
      <line
        x1="56"
        y1="460"
        x2="64"
        y2="460"
        stroke="var(--anatomy-stroke)"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Fade in on mount
    const els = sectionRef.current?.querySelectorAll(".hero-fade");
    els?.forEach((el, i) => {
      setTimeout(
        () => {
          el.classList.add("visible");
        },
        200 + i * 150,
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden transition-colors"
    >
      {/* ─── Main Content ─── */}
      <div className="container mx-auto max-w-300 px-10 lg:px-16 py-24 md:py-32 relative z-10">
        {/* ─── Main Hero Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left — Text */}
          <div>
            <div
              className="hero-fade font-bold fade-in text-[13px] tracking-[5px] uppercase mb-6"
              style={{ color: "var(--red)" }}
            >
              Independent Research Lab
            </div>

            <h1
              className="hero-fade fade-in mb-8"
              style={{
                fontSize: "clamp(56px, 9vw, 110px)",
                fontWeight: 300,
                lineHeight: 0.92,
                letterSpacing: "-3px",
                color: "var(--text)",
              }}
            >
              GRIM
              <br />
              <span style={{ color: "var(--red)" }}>LABS</span>
            </h1>

            <div
              className="hero-fade fade-in w-16 h-px mb-10"
              style={{ background: "var(--red)" }}
            />

            <div
              className="hero-fade fade-in text-[11px] tracking-[3px] uppercase mb-8"
              style={{ color: "var(--white-dim)" }}
            >
              <span style={{ color: "var(--red)" }}>→</span> by obed.gyamfi
            </div>

            <p
              className="hero-fade fade-in max-w-120 text-[16px] leading-[1.9]"
              style={{ color: "var(--white-dim)" }}
            >
              An independent research and engineering laboratory exploring{" "}
              <span
                className="border-b"
                style={{
                  color: "var(--text)",
                  borderColor: "var(--trace-line)",
                }}
              >
                software
              </span>
              ,{" "}
              <span
                className="border-b"
                style={{
                  color: "var(--text)",
                  borderColor: "var(--trace-line)",
                }}
              >
                hardware
              </span>
              , and{" "}
              <span
                className="border-b"
                style={{
                  color: "var(--text)",
                  borderColor: "var(--trace-line)",
                }}
              >
                scientific systems
              </span>{" "}
              through design, experimentation, security research, and open knowledge sharing.
            </p>
          </div>

          {/* Right — Vitruvian Figure */}
          {/*<div className="hero-fade fade-in hidden lg:flex items-center justify-center">
                        <AnatomyFigure />
                    </div>*/}
        </div>
      </div>

      {/* ─── Scroll Indicator ─── */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          fontSize: "9px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: "var(--white-dim)",
          animation: "float 3s ease-in-out infinite",
        }}
      >
        <span>Scroll</span>
        <div
          className="w-px h-10"
          style={{
            background: "linear-gradient(180deg, var(--red), transparent)",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.008);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(8px);
          }
        }
      `}</style>
    </section>
  );
}
