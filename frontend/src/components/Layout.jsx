import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChatWidget from "./AIChatWidget";
import { Toaster } from "sonner";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AIChatWidget />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#fff",
            border: "1px solid #F2E8E3",
            color: "#4A3B32",
            borderRadius: "999px",
            padding: "12px 18px",
            fontFamily: "DM Sans, sans-serif",
          },
        }}
      />
    </div>
  );
};

export default Layout;
