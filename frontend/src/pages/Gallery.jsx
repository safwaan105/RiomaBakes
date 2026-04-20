import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import FloatingDecor from "../components/FloatingDecor";

const IMAGES = [
  "https://images.pexels.com/photos/5964621/pexels-photo-5964621.jpeg",
  "https://images.unsplash.com/photo-1765692799769-a5d4924921fc?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1726749135886-f896fe38df69?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1625489409904-324a5e9591e1?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1720397938084-228faac53600?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.pexels.com/photos/34298814/pexels-photo-34298814.jpeg",
  "https://images.pexels.com/photos/31009878/pexels-photo-31009878.jpeg",
  "https://images.pexels.com/photos/35227476/pexels-photo-35227476.jpeg",
  "https://images.pexels.com/photos/5107179/pexels-photo-5107179.jpeg",
  "https://images.pexels.com/photos/8635161/pexels-photo-8635161.jpeg",
  "https://images.pexels.com/photos/35032379/pexels-photo-35032379.jpeg",
  "https://images.pexels.com/photos/15346745/pexels-photo-15346745.jpeg",
  "https://images.pexels.com/photos/20598678/pexels-photo-20598678.jpeg",
  "https://images.pexels.com/photos/29852581/pexels-photo-29852581.jpeg",
  "https://images.pexels.com/photos/10281287/pexels-photo-10281287.jpeg",
];

const Gallery = () => {
  const [active, setActive] = useState(null);

  const close = () => setActive(null);
  const prev = () => setActive((i) => (i - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setActive((i) => (i + 1) % IMAGES.length);

  return (
    <div data-testid="gallery-page">
      <section className="rb-hero-grad py-16 md:py-24 relative overflow-hidden">
        <FloatingDecor density="light" />
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Instagram className="w-6 h-6 text-[#D4AF37] mx-auto mb-3" />
          <span className="rb-eyebrow">Our feed</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl text-[#4A3B32] rb-underline-center">The sweet gallery</h1>
          <p className="mt-5 text-[#7A675B] max-w-xl mx-auto">
            A little visual diary from the kitchen. Tap any image to see it bigger.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5" data-testid="gallery-grid">
            {IMAGES.map((src, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 8) * 0.04 }}
                onClick={() => setActive(i)}
                className={`rb-gallery-item group ${i % 5 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
                data-testid={`gallery-item-${i}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                <Instagram className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white opacity-0 group-hover:opacity-100 z-10" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-[#4A3B32]/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={close}
            data-testid="lightbox"
          >
            <button onClick={close} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center" data-testid="lightbox-close">
              <X className="w-5 h-5 text-[#4A3B32]" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-5 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
              <ChevronLeft className="w-5 h-5 text-[#4A3B32]" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-5 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-[#4A3B32]" />
            </button>
            <motion.img
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              src={IMAGES[active]}
              alt=""
              className="max-w-[92vw] max-h-[88vh] rounded-3xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
