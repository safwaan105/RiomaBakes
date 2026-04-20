import React from "react";
import { Link } from "react-router-dom";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, updateQty, removeItem, total, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center" data-testid="cart-page-empty">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#FFF6FA] flex items-center justify-center mb-6">
          <ShoppingBag className="w-6 h-6 text-[#4A3B32]" />
        </div>
        <h1 className="font-display text-4xl text-[#4A3B32]">Your basket is empty</h1>
        <p className="mt-3 text-[#7A675B]">Let's fix that — there's something delicious waiting.</p>
        <Link to="/shop" className="rb-btn-primary inline-flex items-center gap-2 mt-8" data-testid="cart-empty-shop">
          Browse the menu <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-10 lg:px-16 py-12 md:py-16" data-testid="cart-page">
      <h1 className="font-display text-4xl md:text-5xl text-[#4A3B32] rb-underline">Your basket</h1>
      <p className="mt-3 text-[#7A675B]">{count} sweet {count === 1 ? "item" : "items"} waiting to be yours.</p>

      <div className="mt-10 grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-4" data-testid="cart-items">
          {items.map((it) => (
            <div key={it.product_id} className="rb-card p-4 md:p-5 flex gap-4 items-center" data-testid={`cart-item-${it.product_id}`}>
              <img src={it.image_url} alt={it.name} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-display text-lg text-[#4A3B32] truncate">{it.name}</div>
                <div className="text-sm text-[#D4AF37] mt-1">${it.price.toFixed(2)}</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center border border-[#F2E8E3] rounded-full">
                    <button onClick={() => updateQty(it.product_id, it.quantity - 1)} className="w-8 h-8 text-[#4A3B32] hover:bg-[#FFF6FA] rounded-l-full">−</button>
                    <span className="w-8 text-center text-sm">{it.quantity}</span>
                    <button onClick={() => updateQty(it.product_id, it.quantity + 1)} className="w-8 h-8 text-[#4A3B32] hover:bg-[#FFF6FA] rounded-r-full">+</button>
                  </div>
                  <button
                    onClick={() => removeItem(it.product_id)}
                    className="text-xs text-[#7A675B] hover:text-[#4A3B32] inline-flex items-center gap-1"
                    data-testid={`remove-${it.product_id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
              <div className="font-display text-lg text-[#4A3B32] hidden sm:block">
                ${(it.price * it.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <aside className="rb-card p-6 md:p-8 h-fit sticky top-24" data-testid="cart-summary">
          <h3 className="font-display text-2xl text-[#4A3B32]">Order summary</h3>
          <div className="mt-5 space-y-2 text-sm text-[#7A675B]">
            <div className="flex justify-between"><span>Subtotal</span><span className="text-[#4A3B32]" data-testid="cart-subtotal">${total.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>Calculated at checkout</span></div>
          </div>
          <div className="border-t border-[#F2E8E3] my-5" />
          <div className="flex justify-between items-end">
            <span className="text-sm text-[#7A675B]">Total</span>
            <span className="font-display text-2xl text-[#4A3B32]" data-testid="cart-total">${total.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="rb-btn-primary w-full inline-flex items-center justify-center gap-2 mt-6" data-testid="cart-checkout-btn">
            Proceed to checkout <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/shop" className="block text-center text-sm text-[#7A675B] hover:text-[#4A3B32] mt-4">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
