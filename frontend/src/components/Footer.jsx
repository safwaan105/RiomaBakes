import React from "react";
import { Link } from "react-router-dom";
import { Instagram, MessageCircle, MapPin, Mail, Phone, Sparkles } from "lucide-react";

const BRAND = {
  instagram: "riomabakes",
  whatsapp: "+919876543210",
  whatsappDisplay: "+91 98765 43210",
  email: "hello@riomabakes.com",
  city: "Mumbai, India",
};

export const brand = BRAND;

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-[#F2E8E3] bg-gradient-to-b from-white to-[#FFF6FA]" data-testid="footer">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F8C8DC] to-[#E6E6FA] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#4A3B32]" />
            </div>
            <span className="font-display text-xl text-[#4A3B32]">Rioma Bakes</span>
          </div>
          <p className="text-[14px] leading-relaxed text-[#7A675B]">
            A boutique pâtisserie baking dreamy little luxuries — cakes, macarons and bespoke
            gifts, always made with love.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg text-[#4A3B32] mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-[#7A675B]">
            <li><Link to="/shop" className="hover:text-[#4A3B32]" data-testid="footer-link-shop">Shop</Link></li>
            <li><Link to="/custom-order" className="hover:text-[#4A3B32]" data-testid="footer-link-custom">Custom Orders</Link></li>
            <li><Link to="/gallery" className="hover:text-[#4A3B32]" data-testid="footer-link-gallery">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-[#4A3B32]" data-testid="footer-link-about">About</Link></li>
            <li><Link to="/contact" className="hover:text-[#4A3B32]" data-testid="footer-link-contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-[#4A3B32] mb-4">Visit</h4>
          <ul className="space-y-3 text-sm text-[#7A675B]">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-[2px] text-[#D4AF37]" /> {BRAND.city}</li>
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-[2px] text-[#D4AF37]" /> {BRAND.whatsappDisplay}</li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-[2px] text-[#D4AF37]" /> {BRAND.email}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-[#4A3B32] mb-4">Stay sweet</h4>
          <p className="text-sm text-[#7A675B] mb-4">Follow us for daily dessert inspiration.</p>
          <div className="flex items-center gap-3">
            <a
              href={`https://instagram.com/${BRAND.instagram}`}
              target="_blank" rel="noreferrer"
              className="w-10 h-10 rounded-full border border-[#F2E8E3] flex items-center justify-center hover:bg-[#FFF6FA] transition"
              data-testid="footer-instagram-link"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 text-[#4A3B32]" />
            </a>
            <a
              href={`https://wa.me/${BRAND.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank" rel="noreferrer"
              className="w-10 h-10 rounded-full border border-[#F2E8E3] flex items-center justify-center hover:bg-[#FFF6FA] transition"
              data-testid="footer-whatsapp-link"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[#4A3B32]" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#F2E8E3]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#7A675B]">© {new Date().getFullYear()} Rioma Bakes. All rights reserved.</p>
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#7A675B]">Baked with love · Designed to delight</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
