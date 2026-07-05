import { motion } from "framer-motion";
import { Boxes, Code2, BrainCircuit, Cable, type LucideIcon } from "lucide-react";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const SERVICES: Service[] = [
  {
    icon: Boxes,
    title: "3D Websites",
    description:
      "Quick-turnaround 3D websites that give your brand or business a striking, memorable presence online.",
  },
  {
    icon: Code2,
    title: "Custom Software",
    description:
      "Custom software built to match your business needs, helping you work faster, smarter, and more efficiently.",
  },
  {
    icon: BrainCircuit,
    title: "AI Consulting",
    description:
      "Hands-on help setting up and optimizing your AI workflows, from n8n automations to Claude-powered setups.",
  },
  {
    icon: Cable,
    title: "Custom LLM Integrations",
    description:
      "Wire large language models directly into your existing software so intelligence works where you already do.",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative bg-ember-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-obsidian to-transparent" />

      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold tracking-[0.25em] text-ember-600">
            WHAT WE DO
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold text-ink-900 sm:text-5xl">
            Four ways we move your business forward
          </h2>
          <p className="mt-4 text-base text-ink-500 sm:text-lg">
            From immersive front-ends to the AI systems running behind them — Obzidian
            Labs covers the full stack of what a modern business needs.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.08 }}
                className="glass-light group relative cursor-default overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-12px_rgba(234,88,12,0.28)]"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ember-300/25 blur-3xl transition-opacity duration-300 group-hover:opacity-80" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-ember-400 to-ember-600 shadow-[0_8px_24px_-6px_rgba(234,88,12,0.55)]">
                  <Icon className="h-7 w-7 text-white" strokeWidth={1.75} />
                </div>

                <h3 className="relative mt-6 font-heading text-xl font-semibold text-ink-900">
                  {service.title}
                </h3>
                <p className="relative mt-2.5 text-[15px] leading-relaxed text-ink-500">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
