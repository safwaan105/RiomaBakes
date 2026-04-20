import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Instagram } from "lucide-react";
import { productsApi, statsApi } from "../lib/api";
import ProductCard from "../components/ProductCard";
import FloatingDecor from "../components/FloatingDecor";

const HERO_BG = "https://images.pexels.com/photos/29852581/pexels-photo-29852581.jpeg";
const HERO_FLOATERS = [
  "https://images.pexels.com/photos/10281287/pexels-photo-10281287.jpeg",
  "https://images.pexels.com/photos/20598678/pexels-photo-20598678.jpeg",
  "https://images.pexels.com/photos/34298814/pexels-photo-34298814.jpeg",
];
const GALLERY_PREVIEW = [
  "https://images.pexels.com/photos/5964621/pexels-photo-5964621.jpeg",
  "https://images.unsplash.com/photo-1765692799769-a5d4924921fc?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1726749135886-f896fe38df69?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1625489409904-324a5e9591e1?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1720397938084-228faac53600?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.pexels.com/photos/35227476/pexels-photo-35227476.jpeg",
];

const useAnimatedNumber = (target = 0, duration = 1400) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
};

const StatCard = ({ label, target, suffix = "+" }) => {
  const n = useAnimatedNumber(target);
  return (
    <div className="text-center">
      <div className="font-display text-4xl md:text-5xl text-[#4A3B32]">
        {n.toLocaleString()}
        <span className="text-[#D4AF37]">{suffix}</span>
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.28em] text-[#7A675B]">{label}</div>
    </div>
  );
};

const Testimonial = ({ quote, name, role, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55, delay: index * 0.08 }}
    className="rb-card p-7 md:p-9"
  >
    <div className="text-[#D4AF37] font-display text-3xl leading-none mb-3">“</div>
    <p className="text-[15px] leading-relaxed text-[#4A3B32]">{quote}</p>
    <div className="mt-5 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F8C8DC] to-[#E6E6FA]" />
      <div>
        <div className="font-display text-[#4A3B32] text-base leading-tight">{name}</div>
        <div className="text-xs text-[#7A675B]">{role}</div>
      </div>
    </div>
  </motion.div>
);

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState({ orders_delivered: 0, happy_customers: 0, custom_creations: 0, years_baking: 0 });

  useEffect(() => {
    productsApi.list({ featured: true }).then(setFeatured).catch(() => {});
    statsApi.get().then(setStats).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden rb-hero-grad" data-testid="hero-section">
        <FloatingDecor />
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(closest-side, rgba(248,200,220,0.55), transparent 70%), radial-gradient(closest-side, rgba(230,230,250,0.5), transparent 70%)`,
            backgroundPosition: "10% 20%, 90% 80%",
            backgroundSize: "60% 60%, 50% 50%",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 md:px-10 lg:px-16 pt-16 md:pt-24 pb-20 md:pb-32 grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="rb-eyebrow inline-flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Boutique pâtisserie · Est. 2018
            </span>
            <h1 className="mt-5 font-display text-[46px] sm:text-6xl lg:text-[72px] leading-[1.02] text-[#4A3B32]">
              Baked with <span className="italic text-[#D4AF37]">love</span>,<br />
              designed to <span className="italic">delight</span>.
            </h1>
            <p className="mt-6 text-[15px] md:text-base max-w-xl text-[#7A675B] leading-relaxed">
              A little pink patisserie where every cake, cookie and hamper is a love letter.
              Hand-piped, slow-baked and styled just for you.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/shop" className="rb-btn-primary inline-flex items-center gap-2" data-testid="hero-order-now">
                Order Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/shop" className="rb-btn-ghost inline-flex items-center gap-2" data-testid="hero-view-menu">
                View Menu
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              <StatCard label="Orders" target={stats.orders_delivered} />
              <StatCard label="Happy Clients" target={stats.happy_customers} />
              <StatCard label="Bespoke" target={stats.custom_creations} />
            </div>
          </motion.div>

          <div className="relative h-[520px] md:h-[620px] hidden lg:block">
            <motion.img
              src={HERO_BG}
              alt="Signature cake"
              className="absolute top-6 right-4 w-[82%] h-[78%] object-cover rounded-[40px] shadow-[0_40px_80px_rgba(248,200,220,0.35)]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
            />
            <motion.img
              src={HERO_FLOATERS[0]}
              alt=""
              className="absolute bottom-6 left-0 w-40 h-40 object-cover rounded-full shadow-xl border-8 border-white"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              src={HERO_FLOATERS[1]}
              alt=""
              className="absolute top-0 left-8 w-28 h-28 object-cover rounded-full shadow-lg border-8 border-white"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
            <motion.img
              src={HERO_FLOATERS[2]}
              alt=""
              className="absolute top-1/2 right-0 w-24 h-24 object-cover rounded-full shadow-lg border-[6px] border-white"
              animate={{ y: [0, 10, 0], rotate: [0, 6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
          </div>
        </div>

        {/* Marquee */}
        <div className="border-y border-[#F2E8E3] bg-white/50 backdrop-blur-md overflow-hidden">
          <div className="rb-marquee-track flex items-center gap-14 py-4 whitespace-nowrap">
            {Array.from({ length: 2 }).flatMap((_, r) =>
              ["Hand-piped florals", "Madagascar vanilla", "Couture packaging", "Sugar-free options", "Gluten-free magic", "Bespoke wedding cakes"].map(
                (w, i) => (
                  <span key={`${r}-${i}`} className="flex items-center gap-14 text-sm text-[#7A675B]">
                    <span className="font-display italic text-[#4A3B32]">{w}</span>
                    <span className="text-[#D4AF37]">✦</span>
                  </span>
                )
              )
            )}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="relative py-20 md:py-28" data-testid="featured-section">
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <span className="rb-eyebrow">The confectionery</span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-[#4A3B32] rb-underline">Featured sweets</h2>
            </div>
            <Link to="/shop" className="text-sm text-[#4A3B32] hover:text-[#D4AF37] inline-flex items-center gap-2" data-testid="featured-view-all">
              Explore the menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featured.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM PREVIEW */}
      <section className="py-20 md:py-28 rb-soft-grad relative overflow-hidden" data-testid="instagram-section">
        <FloatingDecor density="light" />
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
          <div className="text-center mb-12">
            <span className="rb-eyebrow">From the feed</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-[#4A3B32] rb-underline-center">@riomabakes</h2>
            <p className="mt-4 text-[#7A675B] max-w-lg mx-auto">
              A little peek into the prettiest corner of our kitchen.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {GALLERY_PREVIEW.map((src, i) => (
              <Link key={i} to="/gallery" className="rb-gallery-item aspect-square" data-testid={`ig-preview-${i}`}>
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                <Instagram className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white opacity-0 group-hover:opacity-100 z-10" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-28" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
          <div className="text-center mb-14">
            <span className="rb-eyebrow">Kind words</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-[#4A3B32] rb-underline-center">Loved by our little world</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Testimonial
              index={0}
              quote="Rioma made the most breathtaking cake for my engagement — hand-painted florals, ridiculously dreamy. Every guest asked for the baker's name."
              name="Aanya Mehta"
              role="Bride · Mumbai"
            />
            <Testimonial
              index={1}
              quote="The macaron tower for our brand launch was unreal. It tasted as beautiful as it looked — truly boutique quality."
              name="Lena Park"
              role="Founder, Atelier 14"
            />
            <Testimonial
              index={2}
              quote="My go-to for every birthday now. The hampers feel like little couture gifts arriving at the door."
              name="Rhea Kapoor"
              role="Stylist"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-5 md:px-10 lg:px-16">
          <div className="rb-hero-grad rounded-[40px] p-10 md:p-16 relative overflow-hidden border border-[#F2E8E3]">
            <FloatingDecor density="light" />
            <div className="relative max-w-xl">
              <Heart className="w-5 h-5 text-[#D4AF37] mb-4" />
              <h2 className="font-display text-4xl md:text-5xl text-[#4A3B32] leading-tight">
                Dreaming up something bespoke?
              </h2>
              <p className="mt-4 text-[#7A675B]">
                From themed birthday towers to hand-painted wedding cakes — tell us the story,
                we'll bake it.
              </p>
              <Link to="/custom-order" className="mt-7 rb-btn-primary inline-flex items-center gap-2" data-testid="cta-custom-order">
                Start a custom order <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
