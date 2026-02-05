"use client";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export default function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="group relative p-8 rounded-xl border border-white/6 bg-[#111] transition-all duration-300 hover:border-white/12 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
      {/* Top accent line */}
      <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="space-y-4">
        <div className="p-3 bg-[#191919] rounded-lg inline-flex border border-white/4 group-hover:border-white/8 transition-colors">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-neutral-400 leading-relaxed text-sm">{desc}</p>
      </div>
    </div>
  );
}
