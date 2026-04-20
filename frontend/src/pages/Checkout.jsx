import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ordersApi } from "../lib/api";
import { toast } from "sonner";

const Checkout = () => {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!form.customer_name || !form.email || !form.phone || !form.address || !form.city) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const order = await ordersApi.create({ ...form, items, total });
      setDone(order);
      clear();
    } catch (e) {
      toast.error("Could not place order", { description: e?.response?.data?.detail || "Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center" data-testid="checkout-success">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-16 h-16 rounded-full bg-[#F8C8DC] flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-7 h-7 text-[#4A3B32]" />
        </motion.div>
        <h1 className="font-display text-4xl text-[#4A3B32]">Order placed ♡</h1>
        <p className="mt-4 text-[#7A675B]">
          Thank you, {done.customer_name.split(" ")[0]}! Your order <strong className="text-[#4A3B32]">#{done.id.slice(0, 8)}</strong> has been received. We'll whisper back on WhatsApp and email shortly.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/shop" className="rb-btn-primary" data-testid="checkout-continue">Continue shopping</Link>
          <Link to="/" className="rb-btn-ghost">Back home</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-[#4A3B32]">Your basket is empty</h1>
        <Link to="/shop" className="rb-btn-primary inline-block mt-6">Browse menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-10 lg:px-16 py-12 md:py-16" data-testid="checkout-page">
      <Link to="/cart" className="text-sm text-[#7A675B] inline-flex items-center gap-2 hover:text-[#4A3B32]">
        <ArrowLeft className="w-4 h-4" /> Back to cart
      </Link>
      <h1 className="mt-4 font-display text-4xl md:text-5xl text-[#4A3B32] rb-underline">Checkout</h1>

      <form onSubmit={submit} className="mt-10 grid lg:grid-cols-[1fr_380px] gap-10" data-testid="checkout-form">
        <div className="space-y-5">
          <div className="rb-card p-6 md:p-8 space-y-5">
            <h3 className="font-display text-2xl text-[#4A3B32]">Delivery details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full name*" value={form.customer_name} onChange={update("customer_name")} testid="checkout-name" />
              <Field label="Email*" type="email" value={form.email} onChange={update("email")} testid="checkout-email" />
              <Field label="Phone / WhatsApp*" value={form.phone} onChange={update("phone")} testid="checkout-phone" />
              <Field label="City*" value={form.city} onChange={update("city")} testid="checkout-city" />
            </div>
            <Field label="Address*" value={form.address} onChange={update("address")} testid="checkout-address" />
            <div>
              <label className="block text-xs uppercase tracking-[0.22em] text-[#7A675B] mb-2">Notes</label>
              <textarea
                value={form.notes}
                onChange={update("notes")}
                rows={3}
                className="w-full bg-[#FDFBF7] rounded-2xl px-4 py-3 border border-[#F2E8E3] focus:outline-none focus:border-[#F8C8DC] text-sm"
                placeholder="Allergies, delivery window, gift message..."
                data-testid="checkout-notes"
              />
            </div>
          </div>
        </div>

        <aside className="rb-card p-6 md:p-8 h-fit sticky top-24">
          <h3 className="font-display text-2xl text-[#4A3B32]">Your order</h3>
          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
            {items.map((it) => (
              <div key={it.product_id} className="flex gap-3 items-center text-sm">
                <img src={it.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-[#4A3B32]">{it.name}</div>
                  <div className="text-[#7A675B] text-xs">× {it.quantity}</div>
                </div>
                <div className="text-[#4A3B32]">${(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#F2E8E3] my-5" />
          <div className="flex justify-between items-end">
            <span className="text-sm text-[#7A675B]">Total</span>
            <span className="font-display text-2xl text-[#4A3B32]">${total.toFixed(2)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rb-btn-primary w-full mt-6 disabled:opacity-60"
            data-testid="checkout-place-order"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
          <p className="text-[11px] text-[#7A675B] text-center mt-4 leading-relaxed">
            We'll confirm on WhatsApp with payment & delivery options.
          </p>
        </aside>
      </form>
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
      required
      data-testid={testid}
      className="w-full bg-[#FDFBF7] rounded-full px-4 py-3 border border-[#F2E8E3] focus:outline-none focus:border-[#F8C8DC] text-sm"
    />
  </div>
);

export default Checkout;
