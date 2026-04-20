import React from "react";
import { motion } from "framer-motion";

// Subtle floating decorative SVGs (hearts & sparkles) scattered across sections.
const FloatingDecor = ({ density = "normal" }) => {
  const items = [
    { type: "sparkle", top: "8%", left: "6%", size: 24, delay: 0 },
    { type: "heart", top: "20%", right: "8%", size: 22, delay: 0.8 },
    { type: "sparkle", bottom: "18%", left: "10%", size: 18, delay: 1.4 },
    { type: "heart", bottom: "12%", right: "14%", size: 18, delay: 0.4 },
    { type: "sparkle", top: "60%", left: "48%", size: 14, delay: 2.0 },
  ];
  const list = density === "light" ? items.slice(0, 3) : items;

  return (
    <>
      {list.map((it, i) => (
        <motion.div
          key={i}
          className="rb-sparkle"
          style={{
            top: it.top,
            left: it.left,
            right: it.right,
            bottom: it.bottom,
            width: it.size,
            height: it.size,
          }}
          animate={{ y: [0, -14, 0], rotate: [-8, 8, -8], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5 + (i % 3), repeat: Infinity, delay: it.delay, ease: "easeInOut" }}
          aria-hidden="true"
        >
          {it.type === "sparkle" ? (
            <svg viewBox="0 0 24 24" width={it.size} height={it.size} fill="none">
              <path
                d="M12 2l1.8 5.6L19.5 9l-5.7 1.4L12 16l-1.8-5.6L4.5 9l5.7-1.4L12 2z"
                fill="#D4AF37"
                opacity="0.9"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width={it.size} height={it.size} fill="none">
              <path
                d="M12 21s-7-4.35-7-10a4.5 4.5 0 018-2.8A4.5 4.5 0 0119 11c0 5.65-7 10-7 10z"
                fill="#F8C8DC"
              />
            </svg>
          )}
        </motion.div>
      ))}
    </>
  );
};

export default FloatingDecor;
