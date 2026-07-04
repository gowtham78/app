import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Golden cursor — 6px dot follows pointer, 36px ring expands over interactive targets.
 * Desktop only; hidden on touch via CSS.
 */
export default function GoldenCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xDot = gsap.quickTo(dot, "x", { duration: 0.18, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.18, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

    const onMove = (e) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };
    window.addEventListener("mousemove", onMove);

    // Expand ring over data-cursor="expand" elements
    const onOver = (e) => {
      const t = e.target;
      if (t && t.closest && t.closest('[data-cursor="expand"]')) {
        ring.style.opacity = 1;
        ring.style.width = "52px";
        ring.style.height = "52px";
      } else if (t && t.closest && t.closest('a, button, [role="button"]')) {
        ring.style.opacity = 1;
        ring.style.width = "36px";
        ring.style.height = "36px";
      } else {
        ring.style.opacity = 0;
      }
    };
    window.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="gold-cursor-dot" aria-hidden />
      <div ref={ringRef} className="gold-cursor-ring" aria-hidden />
    </>
  );
}
