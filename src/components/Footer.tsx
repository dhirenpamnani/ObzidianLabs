import { Mail, Phone, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-obsidian">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent to-black/40" />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="glass-dark rounded-3xl px-8 py-12 sm:px-12">
          <div className="flex flex-col items-start justify-between gap-10 sm:flex-row">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-black ring-1 ring-white/10">
                  <img
                    src="./OZ_logo.png"
                    alt="Obzidian Labs"
                    className="h-full w-full scale-[1.55] object-contain object-[50%_38%]"
                  />
                </span>
                <span className="font-heading text-[15px] font-semibold tracking-wide text-white">
                  OBZIDIAN <span className="text-ember-400">LABS</span>
                </span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
                3D websites, custom software, and AI systems engineered for ambitious
                businesses.
              </p>
            </div>

            <div className="flex flex-col gap-3.5">
              <a
                href="mailto:obzidianlabs@gmail.com"
                className="group flex cursor-pointer items-center gap-3 text-sm text-white/70 transition-colors duration-200 hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors duration-200 group-hover:border-ember-400/40 group-hover:bg-ember-500/10">
                  <Mail size={16} className="text-ember-400" />
                </span>
                obzidianlabs@gmail.com
              </a>
              <a
                href="tel:+918104506566"
                className="group flex cursor-pointer items-center gap-3 text-sm text-white/70 transition-colors duration-200 hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors duration-200 group-hover:border-ember-400/40 group-hover:bg-ember-500/10">
                  <Phone size={16} className="text-ember-400" />
                </span>
                +91 81045 06566
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-xs text-white/35">

            </p>
            <p className="flex items-center gap-1.5 text-xs text-white/40">
              Powered by
              <Sparkles size={13} className="text-ember-400" />
              <span className="font-medium text-white/70">Dhiren Pamnani</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
