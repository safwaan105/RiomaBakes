import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Heart } from "lucide-react";
import { productsApi } from "../lib/api";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    productsApi.get(id).then(setProduct).catch(() => setProduct(false));
  }, [id]);

  if (product === false) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-24 text-center">
        <p className="text-[#7A675B]">Product not found.</p>
        <Link to="/shop" className="rb-btn-primary inline-block mt-6">Back to shop</Link>
      </div>
    );
  }
  if (!product) return <div className="py-24 text-center text-[#7A675B]">Loading...</div>;

  const add = () => {
    addItem(product, qty);
    toast.success(`${product.name} × ${qty} added to cart`);
  };

  return (
    <div data-testid="product-detail-page" className="py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-5 md:px-10 lg:px-16">
        <Link to="/shop" className="text-sm text-[#7A675B] inline-flex items-center gap-2 hover:text-[#4A3B32]">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="mt-6 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[32px] border border-[#F2E8E3] bg-white"
          >
            <img src={product.image_url} alt={product.name} className="w-full h-auto object-cover aspect-[4/5]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="rb-eyebrow capitalize">{product.category}</span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl text-[#4A3B32] leading-tight">{product.name}</h1>
            <div className="mt-5 font-display text-3xl text-[#D4AF37]">${product.price.toFixed(2)}</div>
            <p className="mt-6 text-[#7A675B] leading-relaxed">{product.description}</p>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center border border-[#F2E8E3] rounded-full bg-white">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 text-[#4A3B32] hover:bg-[#FFF6FA] rounded-l-full" data-testid="qty-decrease">−</button>
                <span className="w-10 text-center text-sm" data-testid="qty-value">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 text-[#4A3B32] hover:bg-[#FFF6FA] rounded-r-full" data-testid="qty-increase">+</button>
              </div>
              <button onClick={add} className="rb-btn-primary flex-1 inline-flex items-center justify-center gap-2" data-testid="detail-add-to-cart">
                <ShoppingBag className="w-4 h-4" /> Add to cart
              </button>
            </div>

            <button onClick={() => { add(); navigate("/checkout"); }} className="mt-3 rb-btn-ghost w-full" data-testid="detail-buy-now">
              Buy now
            </button>

            <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
              <div className="rb-card p-4 text-center">
                <Heart className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                <div className="text-[12px] text-[#7A675B]">Hand-made</div>
              </div>
              <div className="rb-card p-4 text-center">
                <Heart className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                <div className="text-[12px] text-[#7A675B]">Fresh daily</div>
              </div>
              <div className="rb-card p-4 text-center">
                <Heart className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                <div className="text-[12px] text-[#7A675B]">Couture box</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
