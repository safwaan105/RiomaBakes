import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Check, Sparkles } from "lucide-react";
import FloatingDecor from "../components/FloatingDecor";
import { customOrdersApi } from "../lib/api";
import { toast } from "sonner";

const themes = ["Floral", "Minimalist", "Bollywood Glam", "Barbie Pink", "Baby Shower", "Anniversary", "Corporate", "Other"];
const flavours = ["Vanilla Bean", "Red Velvet", "Chocolate Truffle", "Pistachio Rose", "Lemon Lavender", "Strawberry Shortcake", "Biscoff", "Coffee & Caramel"];

const CustomOrder = () => {
  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    occasion: "",
    theme: "Floral",
    flavour: "Vanilla Bean",
    servings: 20,
    event_date: "",
    budget: "",
    description: "",
    reference_image: "",
  });
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Please upload an image under 3 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      setPreview(data);
      setForm((f) => ({ ...f, reference_image: data }));
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await customOrdersApi.create({ ...form, servings: Number(form.servings) });
      setDone(res);
    } catch (err) {
      toast.error("Could not submit request", { description: err?.response?.data?.detail || "Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center" data-testid="custom-order-success">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-[#F8C8DC] flex items-center justify-center mx-auto mb-6">
          <Check className="w-7 h-7 text-[#4A3B32]" />
        </motion.div>
        <h1 className="font-display text-4xl text-[#4A3B32]">Your dream is in our oven</h1>
        <p className="mt-4 text-[#7A675B]">
          Request <strong>#{done.id.slice(0, 8)}</strong> received. We'll reach out within 24 hours to sketch your masterpiece.
        </p>
      </div>
    );
  }

  return (
    <div data-testid="custom-order-page">
      <section className="rb-hero-grad py-16 md:py-24 relative overflow-hidden">
        <FloatingDecor />
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center relative">
          <Sparkles className="w-6 h-6 text-[#D4AF37] mx-auto mb-3" />
          <span className="rb-eyebrow">Bespoke</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl text-[#4A3B32] rb-underline-center">Design your cake</h1>
          <p className="mt-5 text-[#7A675B] max-w-xl mx-auto">
            Tell us your love story, your theme, your favourite flavour — we'll sketch, bake and deliver something uniquely yours.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <form onSubmit={submit} className="rb-card p-6 md:p-10 space-y-6" data-testid="custom-order-form">
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Full name*" value={form.customer_name} onChange={update("customer_name")} testid="co-name" />
              <Field label="Email*" type="email" value={form.email} onChange={update("email")} testid="co-email" />
              <Field label="Phone*" value={form.phone} onChange={update("phone")} testid="co-phone" />
              <Field label="Occasion*" value={form.occasion} onChange={update("occasion")} placeholder="Birthday, wedding, baby shower..." testid="co-occasion" />

              <Select label="Theme" value={form.theme} onChange={update("theme")} options={themes} testid="co-theme" />
              <Select label="Flavour" value={form.flavour} onChange={update("flavour")} options={flavours} testid="co-flavour" />

              <Field label="Servings" type="number" value={form.servings} onChange={update("servings")} testid="co-servings" />
              <Field label="Event date" type="date" value={form.event_date} onChange={update("event_date")} testid="co-date" />
              <Field label="Budget (optional)" value={form.budget} onChange={update("budget")} placeholder="$200 - $400" testid="co-budget" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.22em] text-[#7A675B] mb-2">Describe your vision*</label>
              <textarea
                required
                value={form.description}
                onChange={update("description")}
                rows={5}
                placeholder="Colour palette, florals, personal details..."
                className="w-full bg-[#FDFBF7] rounded-2xl px-4 py-3 border border-[#F2E8E3] focus:outline-none focus:border-[#F8C8DC] text-sm"
                data-testid="co-description"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.22em] text-[#7A675B] mb-2">Reference image (optional)</label>
              <label className="flex items-center gap-4 p-4 bg-[#FDFBF7] rounded-2xl border border-dashed border-[#F2E8E3] cursor-pointer hover:border-[#F8C8DC] transition" data-testid="co-image-label">
                <div className="w-14 h-14 rounded-xl bg-white border border-[#F2E8E3] flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-5 h-5 text-[#7A675B]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#4A3B32]">{preview ? "Change image" : "Upload inspiration"}</div>
                  <div className="text-xs text-[#7A675B]">PNG or JPG up to 3MB</div>
                </div>
                <input type="file" accept="image/*" onChange={onFile} className="hidden" data-testid="co-image-input" />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rb-btn-primary w-full disabled:opacity-60"
              data-testid="co-submit"
            >
              {submitting ? "Sending your dream..." : "Submit custom request"}
            </button>
            <p className="text-[11px] text-[#7A675B] text-center">We respond within 24 hours, Monday to Saturday.</p>
          </form>
        </div>
      </section>
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text", placeholder, testid }) => (
  <div>
    <label className="block text-xs uppercase tracking-[0.22em] text-[#7A675B] mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={label.includes("*")}
      className="w-full bg-[#FDFBF7] rounded-full px-4 py-3 border border-[#F2E8E3] focus:outline-none focus:border-[#F8C8DC] text-sm"
      data-testid={testid}
    />
  </div>
);

const Select = ({ label, value, onChange, options, testid }) => (
  <div>
    <label className="block text-xs uppercase tracking-[0.22em] text-[#7A675B] mb-2">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-[#FDFBF7] rounded-full px-4 py-3 border border-[#F2E8E3] focus:outline-none focus:border-[#F8C8DC] text-sm appearance-none"
      data-testid={testid}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default CustomOrder;
