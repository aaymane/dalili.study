"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const sizeRef = useRef(38);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.style.cursor = "none";

    let cx = -200, cy = -200;
    let rx = -200, ry = -200;
    let rafId;

    const onMove = (e) => { cx = e.clientX; cy = e.clientY; };

    const onOver = (e) => {
      if (e.target.closest("a, button, input, label, [role='button'], [data-cursor]")) {
        sizeRef.current = 54;
        ring.style.transition = "width .3s cubic-bezier(.34,1.56,.64,1), height .3s cubic-bezier(.34,1.56,.64,1), border-color .3s, background .3s";
        ring.style.width  = "54px";
        ring.style.height = "54px";
        ring.style.borderColor = "rgba(77,143,255,0.7)";
        ring.style.background  = "rgba(1,77,248,0.07)";
        dot.style.width  = "10px";
        dot.style.height = "10px";
        dot.style.background = "#fff";
      }
    };

    const onOut = (e) => {
      if (e.target.closest("a, button, input, label, [role='button'], [data-cursor]")) {
        sizeRef.current = 38;
        ring.style.transition = "width .25s ease, height .25s ease, border-color .25s, background .25s";
        ring.style.width  = "38px";
        ring.style.height = "38px";
        ring.style.borderColor = "rgba(77,143,255,0.35)";
        ring.style.background  = "transparent";
        dot.style.width  = "6px";
        dot.style.height = "6px";
        dot.style.background = "#4d8fff";
      }
    };

    function loop() {
      rx += (cx - rx) * 0.1;
      ry += (cy - ry) * 0.1;
      const half = sizeRef.current / 2;
      dot.style.transform  = `translate(${cx - 3}px, ${cy - 3}px)`;
      ring.style.transform = `translate(${rx - half}px, ${ry - half}px)`;
      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      <div ref={dotRef} aria-hidden="true" style={{
        position:"fixed",top:0,left:0,width:6,height:6,
        background:"#4d8fff",borderRadius:"50%",zIndex:10001,
        pointerEvents:"none",willChange:"transform",
        transition:"width .2s ease,height .2s ease,background .2s ease",
        boxShadow:"0 0 10px rgba(77,143,255,0.9),0 0 20px rgba(77,143,255,0.4)",
      }}/>
      <div ref={ringRef} aria-hidden="true" style={{
        position:"fixed",top:0,left:0,width:38,height:38,
        border:"1px solid rgba(77,143,255,0.35)",borderRadius:"50%",
        zIndex:10000,pointerEvents:"none",willChange:"transform",
      }}/>
    </>
  );
}
