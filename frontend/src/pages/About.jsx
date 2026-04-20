import React from "react";
import { motion } from "framer-motion";
import { Heart, Award, Leaf, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import FloatingDecor from "../components/FloatingDecor";

const FOUNDER = "https://images.unsplash.com/photo-1726749135857-9fad0dc1d23c?crop=entropy&cs=srgb&fm=jpg&q=85";
const SHOP = "https://images.pexels.com/photos/29852581/pexels-photo-29852581.jpeg";

const values = [
  { icon: Heart, title: "Made with love", body: "Every piped rosette and painted petal is slowly made by hand in our little studio." },
  { icon: Leaf, title: "Honest ingredients", body: "Cultured butter, single-origin chocolate, real vanilla — no shortcuts, ever." },
  { icon: Award, title: "Couture finish", body: "From packaging to the bow on top, every detail feels as lovely as it tastes." },
  { icon: Sparkles, title: "Bespoke design", body: "We co-create each custom piece like a little love letter to your occasion." },
];

const About = () => (
  <div data-testid="about-page">
    <section className="rb-hero-grad py-16 md:py-24 relative overflow-hidden">
      <FloatingDecor />
      <div className="max-w-5xl mx-auto px-5 md:px-10 text-center">
        <span className="rb-eyebrow">Our story</span>
        <h1 className="mt-3 font-display text-5xl md:text-6xl text-[#4A3B32] rb-underline-center">
          A love letter, <span className="italic">in pink</span>.
        </h1>
        <p className="mt-6 text-[#7A675B] max-w-2xl mx-auto leading-relaxed">
          Rioma Bakes began as a Sunday hobby — one birthday cake for a best friend,
          piped with wobbly roses and a whole lot of heart. Seven years later, we're
          a little boutique pâtisserie dedicated to the same feeling.
        </p>
      </div>
    </section>

    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10 lg:px-16 grid md:grid-cols-2 gap-12 items-center">
        <motion.img
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          src={FOUNDER}
          alt="Founder"
          className="rounded-[40px] w-full h-[480px] object-cover shadow-[0_30px_60px_rgba(248,200,220,0.25)]"
        />
        <div>
          <span className="rb-eyebrow">Meet Ria</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-[#4A3B32] rb-underline">Founder & Head Baker</h2>
          <p className="mt-6 text-[#7A675B] leading-relaxed">
            Pastry-trained in Paris and raised on her grandmother's rosewater cookies,
            Ria built Rioma as a love letter to the quiet luxury of a well-baked cake.
            Every creation reflects that mix of elegance and sweetness.
          </p>
          <p className="mt-4 text-[#7A675B] leading-relaxed">
            "I wanted to build a brand that feels like receiving flowers — but you can eat them."
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/custom-order" className="rb-btn-primary">Start a custom order</Link>
            <Link to="/shop" className="rb-btn-ghost">Browse the menu</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24 rb-soft-grad relative overflow-hidden">
      <FloatingDecor density="light" />
      <div className="max-w-6xl mx-auto px-5 md:px-10 lg:px-16">
        <div className="text-center mb-14">
          <span className="rb-eyebrow">What we stand for</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-[#4A3B32] rb-underline-center">Our little promises</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rb-card p-7 text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#F8C8DC] to-[#E6E6FA] flex items-center justify-center mb-4">
                <v.icon className="w-5 h-5 text-[#4A3B32]" />
              </div>
              <h3 className="font-display text-xl text-[#4A3B32]">{v.title}</h3>
              <p className="mt-2 text-sm text-[#7A675B] leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-10 lg:px-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="rb-eyebrow">The studio</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-[#4A3B32] rb-underline">Where the magic happens</h2>
          <p className="mt-5 text-[#7A675B] leading-relaxed">
            Our pastel-washed studio is stocked with French butter, Italian chocolate, and
            more piping tips than anyone should reasonably own. It's where every order is
            carefully styled and packaged before it travels to you.
          </p>
        </div>
        <motion.img
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          src={SHOP}
          alt="Studio"
          className="rounded-[40px] w-full h-[420px] object-cover"
        />
      </div>
    </section>
  </div>
);

export default About;
