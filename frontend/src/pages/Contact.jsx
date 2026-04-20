import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, MessageCircle, Check, Clock } from "lucide-react";
import FloatingDecor from "../components/FloatingDecor";
import { contactApi } from "../lib/api";
import { brand } from "../components/Footer";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactApi.send(form);
      setSent(true);
    } catch (err) {
      toast.error("Could not send message", { description: err?.response?.data?.detail || "Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const waLink = `https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi Rioma Bakes! I'd love to place an order ♡")}`;

  return (
    <div data-testid="contact-page">
      <section className="rb-hero-grad py-16 md:py-24 relative overflow-hidden">
        <FloatingDecor density="light" />
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <span className="rb-eyebrow">Say hello</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl text-[#4A3B32] rb-underline-center">Come say hi</h1>
          <p className="mt-5 text-[#7A675B] max-w-xl mx-auto">
            The fastest way to reach us is WhatsApp — we usually reply the same day.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-10 lg:px-16 grid lg:grid-cols-[1fr_1.2fr] gap-10">
          {/* Contact cards */}
          <div className="space-y-4">
            <a href={waLink} target="_blank" rel="noreferrer" className="rb-card p-6 flex items-start gap-4 group" data-testid="contact-whatsapp">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F8C8DC] to-[#E6E6FA] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-[#4A3B32]" />
              </div>
              <div>
                <div className="rb-eyebrow">Chat with us</div>
                <div className="font-display text-xl text-[#4A3B32] mt-1 group-hover:text-[#D4AF37] transition">{brand.whatsappDisplay}</div>
                <div className="text-sm text-[#7A675B]">Tap to open WhatsApp</div>
              </div>
            </a>
            <a href={`mailto:${brand.email}`} className="rb-card p-6 flex items-start gap-4" data-testid="contact-email">
              <div className="w-12 h-12 rounded-full bg-[#FFF6FA] flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-[#D4AF37]" /></div>
              <div>
                <div className="rb-eyebrow">Email</div>
                <div className="font-display text-xl text-[#4A3B32] mt-1">{brand.email}</div>
                <div className="text-sm text-[#7A675B]">For bespoke & press</div>
              </div>
            </a>
            <a href={`https://instagram.com/${brand.instagram}`} target="_blank" rel="noreferrer" className="rb-card p-6 flex items-start gap-4" data-testid="contact-instagram">
              <div className="w-12 h-12 rounded-full bg-[#FFF6FA] flex items-center justify-center shrink-0"><Instagram className="w-5 h-5 text-[#D4AF37]" /></div>
              <div>
                <div className="rb-eyebrow">Instagram</div>
                <div className="font-display text-xl text-[#4A3B32] mt-1">@{brand.instagram}</div>
                <div className="text-sm text-[#7A675B]">See our daily creations</div>
              </div>
            </a>
            <div className="rb-card p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF6FA] flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-[#D4AF37]" /></div>
              <div>
                <div className="rb-eyebrow">Studio</div>
                <div className="font-display text-xl text-[#4A3B32] mt-1">{brand.city}</div>
                <div className="text-sm text-[#7A675B] flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> Tue – Sun · 10am – 7pm</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rb-card p-6 md:p-10"
          >
            {sent ? (
              <div className="text-center py-12" data-testid="contact-success">
                <div className="w-14 h-14 rounded-full bg-[#F8C8DC] flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-[#4A3B32]" />
                </div>
                <h3 className="font-display text-3xl text-[#4A3B32]">Note received ♡</h3>
                <p className="text-[#7A675B] mt-2">We'll reply as soon as the buttercream sets.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5" data-testid="contact-form">
                <h3 className="font-display text-2xl md:text-3xl text-[#4A3B32]">Send us a note</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Name*" value={form.name} onChange={update("name")} testid="contact-name" />
                  <Field label="Email*" type="email" value={form.email} onChange={update("email")} testid="contact-email-input" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Phone" value={form.phone} onChange={update("phone")} testid="contact-phone" />
                  <Field label="Subject*" value={form.subject} onChange={update("subject")} testid="contact-subject" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.22em] text-[#7A675B] mb-2">Message*</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={update("message")}
                    rows={5}
                    className="w-full bg-[#FDFBF7] rounded-2xl px-4 py-3 border border-[#F2E8E3] focus:outline-none focus:border-[#F8C8DC] text-sm"
                    data-testid="contact-message"
                  />
                </div>
                <button type="submit" disabled={submitting} className="rb-btn-primary w-full disabled:opacity-60" data-testid="contact-submit">
                  {submitting ? "Sending..." : "Send message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text", testid }) => (
  <div>
    <label className="block text-xs uppercase tracking-[0.22em] text-[#7A675B] mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={label.includes("*")}
      className="w-full bg-[#FDFBF7] rounded-full px-4 py-3 border border-[#F2E8E3] focus:outline-none focus:border-[#F8C8DC] text-sm"
      data-testid={testid}
    />
  </div>
);

export default Contact;
