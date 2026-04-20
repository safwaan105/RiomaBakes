import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/custom-order", label: "Custom Orders" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const location = useLocation();

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 rb-glass" data-testid="main-navbar">
      <nav className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 h-[78px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" data-testid="nav-logo">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F8C8DC] to-[#E6E6FA] flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-[#4A3B32]" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-xl text-[#4A3B32] tracking-tight">Rioma Bakes</div>
            <div className="text-[10px] tracking-[0.28em] uppercase text-[#7A675B]">Boutique Bakery</div>
          </div>
        </Link>

        <ul className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `text-[14px] font-medium transition-colors ${
                    isActive ? "text-[#4A3B32]" : "text-[#7A675B] hover:text-[#4A3B32]"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            data-testid="nav-cart-button"
            className="relative rb-btn-ghost !px-5 !py-2.5 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Cart</span>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-[#D4AF37] text-white text-[10px] font-semibold flex items-center justify-center px-1"
                data-testid="nav-cart-count"
              >
                {count}
              </span>
            )}
          </Link>
          <button
            className="lg:hidden p-2 rounded-full hover:bg-[#FFF6FA] text-[#4A3B32]"
            onClick={() => setOpen((v) => !v)}
            data-testid="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden rb-glass border-t border-[#F2E8E3]"
            data-testid="nav-mobile-menu"
          >
            <ul className="px-6 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `block py-3 border-b border-[#F2E8E3]/60 text-[15px] ${
                        isActive ? "text-[#4A3B32] font-medium" : "text-[#7A675B]"
                      }`
                    }
                    data-testid={`nav-mobile-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
