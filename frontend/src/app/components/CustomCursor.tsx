import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export function CustomCursor() {
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const tick = () => {
      setPos({ x: cursorRef.current.x, y: cursorRef.current.y });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);

    const checkHover = (e: MouseEvent) => {
      const el = e.target as Element;
      const isInteractive = el.closest("a, button, [data-cursor-hover], input, textarea");
      setHovered(!!isInteractive);
    };
    window.addEventListener("mouseover", checkHover);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", checkHover);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          left: pos.x,
          top: pos.y,
          x: "-50%",
          y: "-50%",
          width: hovered ? 32 : 10,
          height: hovered ? 32 : 10,
          backgroundColor: "rgba(0, 240, 255, 0.9)",
          boxShadow: hovered
            ? "0 0 20px rgba(0,240,255,0.8), 0 0 40px rgba(0,240,255,0.4)"
            : "0 0 8px rgba(0,240,255,0.6)",
          opacity: visible ? 1 : 0,
          transition: "width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease",
          mixBlendMode: "screen",
        }}
      />
      {/* Trailing ring */}
      <motion.div
        className="fixed pointer-events-none z-[9998] rounded-full border"
        animate={{
          left: pos.x,
          top: pos.y,
          width: hovered ? 50 : 28,
          height: hovered ? 50 : 28,
          opacity: visible ? 0.4 : 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.5 }}
        style={{
          x: "-50%",
          y: "-50%",
          borderColor: "rgba(0,240,255,0.5)",
        }}
      />
    </>
  );
}
