import { useLayoutEffect, useRef, useState, Suspense } from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ImmersiveHero — real 360° equirectangular panorama tour of ONE luxury home.
 * The camera is inside a sphere with the panorama mapped to the inside.
 * Scroll controls YAW, subtle PITCH and FOV to create a professionally
 * directed guided architectural tour.
 *
 * Asset: /panoramas/hero-home.jpg  (2:1 equirectangular — replaceable)
 * — Swap this single file with a real Suntek project panorama when available.
 *
 * Total hero scroll: 220vh (pacing preserved from previous refinement).
 */

const PANO_URL = "/panoramas/hero-home.jpg";

// Professionally directed camera keyframes (progress → yaw°, pitch°, FOV)
const CAM_KEYS = [
  { p: 0.00, yaw: -38, pitch: -1, fov: 60 },
  { p: 0.15, yaw: -14, pitch:  0, fov: 68 },
  { p: 0.30, yaw:   6, pitch: -1, fov: 72 },
  { p: 0.45, yaw:  28, pitch:  0, fov: 68 },
  { p: 0.60, yaw:  54, pitch: -2, fov: 62 },
  { p: 0.75, yaw:  82, pitch: -4, fov: 54 },
  { p: 0.90, yaw: 112, pitch: -1, fov: 66 },
  { p: 1.00, yaw: 140, pitch:  0, fov: 60 },
];

const CHAPTERS = [
  { label: "Entrance",   range: [0, 18] },
  { label: "Living",     range: [18, 40] },
  { label: "Dining",     range: [40, 60] },
  { label: "Craft",      range: [60, 82] },
  { label: "Reimagined", range: [82, 100] },
];

function Panorama({ camState }) {
  const texture = useLoader(THREE.TextureLoader, PANO_URL);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const meshRef = useRef();
  const { camera, gl } = useThree();

  // Apply state each frame via ref values — no React re-renders during scroll
  useLayoutEffect(() => {
    gl.setPixelRatio(Math.min(2, window.devicePixelRatio));
    camera.position.set(0, 0, 0.01);
  }, [camera, gl]);

  // Frame-loop uses camState from parent (mutable ref)
  useLayoutEffect(() => {
    let raf;
    const tick = () => {
      const { yaw, pitch, fov, mouseX, mouseY } = camState.current;
      // Apply subtle mouse influence (±3°) on top of scroll-driven yaw/pitch
      camera.rotation.order = "YXZ";
      camera.rotation.y = THREE.MathUtils.degToRad(-yaw - mouseX * 3);
      camera.rotation.x = THREE.MathUtils.degToRad(pitch + mouseY * 1.5);
      camera.fov = fov;
      camera.updateProjectionMatrix();
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [camera, camState]);

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <sphereGeometry args={[500, 96, 64]} />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <meshBasicMaterial map={texture} side={THREE.BackSide} toneMapped={false} />
    </mesh>
  );
}

export default function ImmersiveHero() {
  const containerRef = useRef(null);
  const rootRef = useRef(null);
  const chapterLabelRef = useRef(null);
  const chapterNumberRef = useRef(null);
  const progressNumRef = useRef(null);
  const progressFillRef = useRef(null);

  // Mutable camera state — driven directly by ScrollTrigger, read by RAF loop
  const camState = useRef({ yaw: -38, pitch: -1, fov: 60, mouseX: 0, mouseY: 0 });
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    // Preload panorama for the first frame
    const img = new Image();
    img.onload = img.onerror = () => setReady(true);
    img.src = PANO_URL;
    const t = setTimeout(() => setReady(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Linear interpolation helper across CAM_KEYS
    const sampleCam = (p) => {
      for (let i = 0; i < CAM_KEYS.length - 1; i++) {
        const a = CAM_KEYS[i], b = CAM_KEYS[i + 1];
        if (p >= a.p && p <= b.p) {
          const t = (p - a.p) / (b.p - a.p);
          const ease = t * t * (3 - 2 * t); // smoothstep
          return {
            yaw:   a.yaw   + (b.yaw   - a.yaw)   * ease,
            pitch: a.pitch + (b.pitch - a.pitch) * ease,
            fov:   a.fov   + (b.fov   - a.fov)   * ease,
          };
        }
      }
      return CAM_KEYS[CAM_KEYS.length - 1];
    };

    const ctx = gsap.context(() => {
      // 1.5s entrance sequence (independent of scroll)
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(".intro-line", { scaleX: 0 }, { scaleX: 1, duration: 0.4 }, 0)
        .fromTo(".intro-logo-wrap", { opacity: 0, y: 24, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55 }, 0.3)
        .fromTo(".intro-sub", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0.55)
        .fromTo(".intro-statement", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
        .fromTo(".intro-scroll", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.2);

      // MASTER scrubbed timeline
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: prefersReduced ? true : 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            const { yaw, pitch, fov } = sampleCam(p);
            camState.current.yaw = yaw;
            camState.current.pitch = pitch;
            camState.current.fov = fov;

            const pct = Math.round(p * 100);
            if (progressNumRef.current) progressNumRef.current.textContent = String(pct).padStart(2, "0");
            if (progressFillRef.current) progressFillRef.current.style.height = `${pct}%`;
            const ch = CHAPTERS.find((c) => pct <= c.range[1]) || CHAPTERS[CHAPTERS.length - 1];
            const idx = CHAPTERS.indexOf(ch);
            if (chapterLabelRef.current) chapterLabelRef.current.textContent = ch.label;
            if (chapterNumberRef.current) chapterNumberRef.current.textContent = `0${idx + 1} / 0${CHAPTERS.length}`;
          },
        },
      });

      // ============ TEXT INITIAL STATES ============
      gsap.set(".txt-s1", { opacity: 1 });
      gsap.set(".txt-s2-we", { opacity: 0, yPercent: 30, xPercent: -4 });
      gsap.set(".txt-s2-way", { opacity: 0, xPercent: 15, scale: 1.15 });
      gsap.set(".txt-s2-live", { opacity: 0, yPercent: 40, scale: 0.95 });
      gsap.set(".txt-s3-num", { opacity: 0, scale: 1.25 });
      gsap.set(".txt-s3-num2", { opacity: 0, scale: 1.25 });
      gsap.set(".txt-s4-a", { opacity: 0, yPercent: 30, xPercent: -8 });
      gsap.set(".txt-s4-b", { opacity: 0, yPercent: 40, xPercent: 8 });
      gsap.set(".txt-s4-c", { opacity: 0, yPercent: 50 });
      gsap.set(".txt-s5-title", { opacity: 0, yPercent: 20 });
      gsap.set(".txt-s5-cta", { opacity: 0, yPercent: 12 });

      // ============ TEXT CHOREOGRAPHY (matched to camera direction) ============
      // Living reveal (18-40)
      tl.to(".txt-s1", { opacity: 0, y: -18, duration: 5 }, 14)
        .to(".txt-s2-we",   { opacity: 1, yPercent: 0, xPercent: 0, duration: 4 }, 18)
        .to(".txt-s2-way",  { opacity: 1, xPercent: 0, scale: 1, duration: 4 }, 22)
        .to(".txt-s2-live", { opacity: 1, yPercent: 0, scale: 1, duration: 4 }, 26)
        .to([".txt-s2-we", ".txt-s2-way", ".txt-s2-live"], { opacity: 0, yPercent: -15, duration: 4, stagger: 0.15 }, 36);

      // Dining stats (40-60)
      tl.to(".txt-s3-num",  { opacity: 1, scale: 1, duration: 4 }, 42)
        .to(".txt-s3-num",  { opacity: 0, xPercent: -8, duration: 4 }, 50)
        .to(".txt-s3-num2", { opacity: 1, scale: 1, duration: 4 }, 51)
        .to(".txt-s3-num2", { opacity: 0, xPercent: 8, duration: 4 }, 58);

      // Craft (60-82) — overlapped
      tl.to(".txt-s4-a", { opacity: 1, yPercent: 0, xPercent: 0, duration: 3 }, 62)
        .to(".txt-s4-b", { opacity: 1, yPercent: 0, xPercent: 0, duration: 3 }, 65)
        .to(".txt-s4-c", { opacity: 1, yPercent: 0, duration: 3 }, 68)
        .to([".txt-s4-a", ".txt-s4-b", ".txt-s4-c"], { opacity: 0, yPercent: -12, duration: 3, stagger: 0.1 }, 78);

      // Reimagined + CTA (82-100)
      tl.to(".txt-s5-title", { opacity: 1, yPercent: 0, duration: 4 }, 84)
        .to(".txt-s5-cta",   { opacity: 1, yPercent: 0, duration: 3 }, 88);

      // ---------- Mouse influence on camera (subtle ±3°) ----------
      if (!prefersReduced && window.matchMedia("(pointer: fine)").matches) {
        const onMove = (e) => {
          camState.current.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
          camState.current.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    }, rootRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={containerRef}
      id="top"
      data-testid="immersive-hero"
      className="relative w-full bg-[#0d0d0b]"
      style={{ height: "220vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0d0d0b]">
        <div ref={rootRef} className="absolute inset-0">
          {/* R3F Canvas — real 360° panorama sphere */}
          <div className="absolute inset-0">
            <Canvas
              gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
              camera={{ fov: 60, near: 0.01, far: 1000, position: [0, 0, 0.01] }}
              dpr={[1, 2]}
              style={{ background: "#0d0d0b" }}
            >
              <Suspense fallback={null}>
                <Panorama camState={camState} />
              </Suspense>
            </Canvas>
          </div>

          {/* Warm cinematic overlays */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(180deg, rgba(184,154,91,0.05) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)"
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)"
          }} />
          <div className="absolute inset-0 grain pointer-events-none" />

          {/* ============ SCENE 1 TEXT (initial state — visible immediately) ============ */}
          <div className="txt-s1 absolute inset-0 pointer-events-none">
            <div className="absolute top-[38%] left-[6vw] max-w-2xl">
              <div className="intro-line h-px w-24 bg-[#B89A5B] origin-left mb-6" />
              <div className="intro-sub text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-[#D8D0C2]/85 font-sans mb-5">
                Interior Architecture · Singapore — Since 2007
              </div>
              <div className="intro-logo-wrap">
                <img src="/brand/suntek-logo.png" alt="Suntek Designs"
                     className="h-16 md:h-24 lg:h-28 w-auto"
                     style={{ filter: "drop-shadow(0 4px 20px rgba(184,154,91,0.4))" }} draggable={false} />
              </div>
              <div className="intro-statement mt-6 font-display text-[#F3F0E8]/90 tracking-tight leading-[0.95]" style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.4rem)", fontWeight: 300 }}>
                Spaces, <em className="text-[#D2B879]">considered.</em>
              </div>
            </div>
            <div className="intro-scroll absolute bottom-[6vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#F3F0E8]/60">
              <span className="text-[9px] tracking-[0.5em] uppercase font-sans">Scroll to enter</span>
              <div className="w-px h-8 bg-gradient-to-b from-[#F3F0E8]/60 to-transparent" />
            </div>
          </div>

          {/* ============ SCENE 2 (Living) ============ */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="txt-s2-we absolute left-[6vw] top-[12%]">
              <span className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(4rem, 12vw, 12rem)", fontWeight: 300, lineHeight: 0.88, letterSpacing: "-0.03em" }}>
                We Design
              </span>
            </div>
            <div className="txt-s2-way absolute right-[6vw] top-[38%] text-right">
              <span className="font-display italic text-[#D2B879]" style={{ fontSize: "clamp(4rem, 12vw, 12rem)", fontWeight: 300, lineHeight: 0.88, letterSpacing: "-0.03em" }}>
                the way
              </span>
            </div>
            <div className="txt-s2-live absolute left-[22vw] bottom-[8%]">
              <span className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(4rem, 12vw, 12rem)", fontWeight: 300, lineHeight: 0.88, letterSpacing: "-0.03em" }}>
                you live.
              </span>
            </div>
          </div>

          {/* ============ SCENE 3 (Dining stats) ============ */}
          <div className="txt-s3-num absolute inset-0 pointer-events-none flex items-center justify-end pr-[6vw]">
            <div className="text-right">
              <div className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(6rem, 17vw, 19rem)", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.04em" }}>
                3500<span className="text-[#B89A5B]">+</span>
              </div>
              <div className="mt-4 text-[10px] tracking-[0.5em] uppercase text-[#D8D0C2] font-sans">
                Spaces Transformed
              </div>
            </div>
          </div>
          <div className="txt-s3-num2 absolute inset-0 pointer-events-none flex items-center px-[6vw]">
            <div>
              <div className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(6rem, 17vw, 19rem)", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.04em" }}>
                800<span className="text-[#B89A5B]">+</span>
              </div>
              <div className="mt-4 text-[10px] tracking-[0.5em] uppercase text-[#D8D0C2] font-sans">
                Clients &middot; Homes &middot; Studios
              </div>
            </div>
          </div>

          {/* ============ SCENE 4 (Craft) ============ */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="txt-s4-a absolute left-[6vw] top-[18%]">
              <span className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(3.5rem, 10vw, 10rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
                Designed.
              </span>
            </div>
            <div className="txt-s4-b absolute right-[6vw] top-[42%] text-right">
              <span className="font-display italic text-[#D2B879]" style={{ fontSize: "clamp(3.5rem, 10vw, 10rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
                Built.
              </span>
            </div>
            <div className="txt-s4-c absolute left-1/2 -translate-x-1/2 bottom-[14%]">
              <span className="font-display text-[#F3F0E8]" style={{ fontSize: "clamp(3.5rem, 10vw, 10rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
                Delivered.
              </span>
            </div>
          </div>

          {/* ============ SCENE 5 (Reimagined + CTA) ============ */}
          <div className="absolute inset-0 pointer-events-none flex items-center">
            <div className="w-full px-[6vw]">
              <div className="txt-s5-title">
                <div className="text-[10px] tracking-[0.5em] uppercase text-[#B89A5B] font-sans mb-6">
                  The Vision
                </div>
                <h2 className="font-display text-[#F3F0E8] leading-[0.9] tracking-[-0.03em] max-w-6xl" style={{ fontSize: "clamp(3.5rem, 11vw, 12rem)", fontWeight: 300 }}>
                  Your Space.<br />
                  <em className="not-italic text-[#D2B879]">Reimagined.</em>
                </h2>
              </div>
              <div className="txt-s5-cta mt-10 md:mt-14 pointer-events-auto">
                <a href="#projects" data-testid="hero-cta-start" data-cursor="expand"
                   className="inline-flex items-center gap-4 text-[#F3F0E8] group">
                  <span className="text-[11px] tracking-[0.4em] uppercase font-sans border-b border-[#D2B879]/70 pb-2 group-hover:border-[#D2B879] group-hover:text-[#D2B879] transition-colors duration-500">
                    Enter the Home
                  </span>
                  <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="group-hover:translate-x-2 transition-transform duration-500">
                    <path d="M0 5h26M22 1l4 4-4 4" stroke="currentColor" strokeWidth="1.1" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* HUD */}
          <div className="absolute bottom-[6vh] left-[6vw] z-30 flex items-baseline gap-4 text-[#F3F0E8]/80 pointer-events-none">
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#D2B879] font-sans" ref={chapterNumberRef}>01 / 05</span>
            <span className="w-6 h-px bg-[#F3F0E8]/40" />
            <span className="text-[10px] tracking-[0.4em] uppercase font-sans" ref={chapterLabelRef}>Entrance</span>
          </div>

          <div className="gold-progress hidden md:block">
            <div className="gold-progress-fill" ref={progressFillRef} />
            <div className="absolute -left-[52px] top-0 flex flex-col gap-6 items-end">
              {[1,2,3,4,5].map((n) => (
                <span key={n} className="text-[9px] tracking-[0.3em] uppercase text-[#F3F0E8]/40 font-sans">0{n}</span>
              ))}
            </div>
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col items-end">
              <span ref={progressNumRef} className="text-[9px] tracking-[0.3em] uppercase text-[#D2B879] font-sans">00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading veil */}
      {!ready && (
        <div className="fixed inset-0 z-[100] bg-[#0d0d0b] flex items-center justify-center">
          <div className="text-center">
            <img src="/brand/suntek-logo.png" alt="Suntek" className="h-12 w-auto mx-auto mb-6" style={{ opacity: 0.9 }} />
            <div className="w-32 h-px bg-[#D8D0C2]/20 relative overflow-hidden mx-auto">
              <div className="absolute inset-y-0 w-1/3 bg-[#B89A5B]" style={{ animation: "ldg 1.2s ease-in-out infinite" }} />
            </div>
          </div>
          <style>{`@keyframes ldg { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }`}</style>
        </div>
      )}
    </section>
  );
}
