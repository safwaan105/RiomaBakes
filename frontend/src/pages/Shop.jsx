import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import FloatingDecor from "../components/FloatingDecor";
import { productsApi } from "../lib/api";

const categories = [
  { id: "all", label: "All" },
  { id: "cakes", label: "Cakes" },
  { id: "cookies", label: "Cookies" },
  { id: "hampers", label: "Hampers" },
  { id: "custom", label: "Custom Orders" },
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productsApi.list().then((d) => {
      setProducts(d);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(
    () => (active === "all" ? products : products.filter((p) => p.category === active)),
    [products, active]
  );

  return (
    <div data-testid="shop-page">
      <section className="rb-hero-grad py-16 md:py-24 relative overflow-hidden">
        <FloatingDecor density="light" />
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 text-center">
          <span className="rb-eyebrow">Our menu</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl text-[#4A3B32] rb-underline-center">Shop the bakery</h1>
          <p className="mt-5 max-w-xl mx-auto text-[#7A675B]">
            Handmade in tiny batches, styled for every celebration — big or tiny.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12" data-testid="category-filters">
            {categories.map((c) => {
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  data-testid={`filter-${c.id}`}
                  className={`px-5 py-2.5 rounded-full text-sm transition-all border ${
                    isActive
                      ? "bg-[#F8C8DC] border-[#F8C8DC] text-[#4A3B32] shadow-[0_8px_20px_rgba(248,200,220,0.4)]"
                      : "bg-white border-[#F2E8E3] text-[#7A675B] hover:border-[#F8C8DC]"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="text-center text-[#7A675B]">Whisking up the menu...</div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </motion.div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-[#7A675B]">No sweets in this drawer yet — check back soon.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
