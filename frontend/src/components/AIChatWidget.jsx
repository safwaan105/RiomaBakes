import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { chatApi } from "../lib/api";

const getSessionId = () => {
  let s = localStorage.getItem("rioma_chat_session");
  if (!s) {
    s = `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("rioma_chat_session", s);
  }
  return s;
};

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi lovely! I'm Rioma — ask me about our cakes, hampers, or custom orders.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef(null);
  const sessionId = useRef(getSessionId()).current;

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await chatApi.send(sessionId, text);
      setMessages((m) => [...m, { role: "assistant", text: res.reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Oh sugar, our line is a little sticky. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]" data-testid="ai-chat-widget">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-3 w-[92vw] max-w-[380px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(74,59,50,0.15)] border border-[#F2E8E3] overflow-hidden"
            data-testid="ai-chat-panel"
          >
            <div className="px-5 py-4 flex items-center justify-between bg-gradient-to-r from-[#FFE6F1] to-[#EFE9FB] border-b border-[#F2E8E3]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="font-display text-[#4A3B32]">Chat with Rioma</div>
                  <div className="text-[11px] text-[#7A675B]">usually replies in a blink</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/70 flex items-center justify-center"
                aria-label="Close chat"
                data-testid="ai-chat-close"
              >
                <X className="w-4 h-4 text-[#4A3B32]" />
              </button>
            </div>

            <div
              ref={scrollerRef}
              className="px-4 py-4 h-[340px] overflow-y-auto bg-[#FDFBF7]"
              data-testid="ai-chat-messages"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-2.5 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#F8C8DC] text-[#4A3B32] rounded-br-md"
                        : "bg-white text-[#4A3B32] border border-[#F2E8E3] rounded-bl-md"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start mb-2">
                  <div className="bg-white border border-[#F2E8E3] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm text-[#7A675B]">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F8C8DC] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F8C8DC] animate-bounce" style={{ animationDelay: "120ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F8C8DC] animate-bounce" style={{ animationDelay: "240ms" }} />
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t border-[#F2E8E3] flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about flavours, delivery..."
                className="flex-1 bg-[#FDFBF7] rounded-full px-4 py-2.5 text-sm border border-[#F2E8E3] focus:outline-none focus:border-[#F8C8DC]"
                data-testid="ai-chat-input"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-full bg-[#F8C8DC] hover:bg-[#F2B8D0] text-[#4A3B32] flex items-center justify-center disabled:opacity-50 transition"
                data-testid="ai-chat-send"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <AnimatePresence>
          {hover && !open && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute bottom-1/2 translate-y-1/2 right-[70px] whitespace-nowrap bg-white px-4 py-2 rounded-full shadow-[0_10px_30px_rgba(74,59,50,0.12)] border border-[#F2E8E3] text-sm text-[#4A3B32] font-medium"
            >
              Hi lovely! Need help?
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F8C8DC] to-[#E6E6FA] shadow-[0_10px_30px_rgba(248,200,220,0.45)] flex items-center justify-center hover:scale-105 transition-transform"
          data-testid="ai-chat-toggle"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 text-[#4A3B32]" />
        </button>
      </div>
    </div>
  );
};

export default AIChatWidget;
