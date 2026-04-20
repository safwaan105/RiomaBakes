import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product, index = 0 }) => {
  const { addItem } = useCart();

  const add = () => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart`, {
      description: "Peek into your basket to keep baking up your order.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: (index % 8) * 0.06 }}
      className="rb-card overflow-hidden group"
      data-testid={`product-card-${product.id}`}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
            loading="lazy"
          />
          {product.featured && (
            <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.22em] bg-white/90 text-[#4A3B32] px-3 py-1 rounded-full border border-[#F2E8E3]">
              Bestseller
            </span>
          )}
          <span className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.22em] bg-[#4A3B32]/80 text-white px-3 py-1 rounded-full capitalize">
            {product.category}
          </span>
        </div>
      </Link>
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display text-lg md:text-xl text-[#4A3B32] leading-tight">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <span className="font-display text-lg text-[#D4AF37] shrink-0">${product.price.toFixed(0)}</span>
        </div>
        <p className="text-sm text-[#7A675B] line-clamp-2 mb-5">{product.description}</p>
        <button
          onClick={add}
          className="w-full rb-btn-primary !py-3 flex items-center justify-center gap-2 text-sm"
          data-testid={`add-to-cart-${product.id}`}
        >
          <ShoppingBag className="w-4 h-4" /> Add to cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
