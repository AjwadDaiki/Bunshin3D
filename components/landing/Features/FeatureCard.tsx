"use client";

import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient: string;
}

export default function FeatureCard({ icon, title, desc, gradient }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative p-8 rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm transition-all hover:border-white/10 hover:-translate-y-1",
        "overflow-hidden"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br",
          gradient
        )}
      ></div>

      <div className="relative z-10 space-y-4">
        <div className="p-3 bg-zinc-950 rounded-2xl inline-flex ring-1 ring-white/10 shadow-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-zinc-400 leading-relaxed text-sm">{desc}</p>
      </div>
    </div>
  );
}
