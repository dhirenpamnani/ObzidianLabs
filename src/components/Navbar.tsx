import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#vision" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4"
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-xl transition-shadow duration-300 sm:px-5 ${
          scrolled ? "shadow-[0_8px_32px_-8px_rgba(234,88,12,0.35)]" : "shadow-none"
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-black ring-1 ring-white/10">
            <img src="./OZ_logo.png" alt="Obzidian Labs" className="h-full w-full scale-[1.55] object-contain object-[50%_38%]" />
          </span>
          <span className="font-heading text-[15px] font-semibold tracking-wide text-white">
            OBZIDIAN <span className="text-ember-400">LABS</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href="#contact"
            className="cursor-pointer rounded-full bg-gradient-to-r from-ember-500 to-ember-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_-4px_rgba(249,115,22,0.6)] transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]"
          >
            Get in touch
          </a>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer rounded-lg p-2 text-white md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl border border-white/10 bg-black/70 p-3 backdrop-blur-xl md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg bg-gradient-to-r from-ember-500 to-ember-600 px-3 py-2.5 text-center text-sm font-semibold text-white"
          >
            Get in touch
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
