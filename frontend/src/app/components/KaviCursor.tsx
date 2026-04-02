import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function KaviCursor() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  const dotX = useSpring(mx, { damping: 30, stiffness: 800 });
  const dotY = useSpring(my, { damping: 30, stiffness: 800 });
  const ringX = useSpring(mx, { damping: 18, stiffness: 180 });
  const ringY = useSpring(my, { damping: 18, stiffness: 180 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const enter = () => setHovered(true);
    const leave = () => setHovered(false);

    window.addEventListener("mousemove", move);

    const addListeners = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
      });
    };

    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Dot */}
      <motion.div
        style={{
          position: "fixed",
          left: dotX,
          top: dotY,
          x: "-50%",
          y: "-50%",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#4F8EF7",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: visible ? 1 : 0,
        }}
        animate={{ scale: hovered ? 2 : 1 }}
        transition={{ duration: 0.15 }}
      />

      {/* Ring */}
      <motion.div
        style={{
          position: "fixed",
          left: ringX,
          top: ringY,
          x: "-50%",
          y: "-50%",
          borderRadius: "50%",
          border: `1px solid rgba(79,142,247,${hovered ? 0.7 : 0.35})`,
          pointerEvents: "none",
          zIndex: 99998,
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width: hovered ? 52 : 36,
          height: hovered ? 52 : 36,
          boxShadow: hovered
            ? "0 0 24px rgba(79,142,247,0.35), inset 0 0 12px rgba(79,142,247,0.08)"
            : "0 0 8px rgba(79,142,247,0.1)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </>
  );
}
