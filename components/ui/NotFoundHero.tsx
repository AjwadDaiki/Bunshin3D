import Link from "next/link";
import { BunshinLogo } from "@/components/ui/BunshinLogo";
import { House, ArrowRight } from "@phosphor-icons/react/dist/ssr";

// On définit les props attendues
interface NotFoundHeroProps {
  title: string;
  description: string;
  action: string;
}

export default function NotFoundHero({
  title,
  description,
  action,
}: NotFoundHeroProps) {
  // PLUS DE useTranslations ICI

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0a0f]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-secondary/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Logo Glitch Effect */}
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-brand-primary/50 blur-xl group-hover:blur-2xl transition-all duration-500 rounded-full opacity-50" />
          <BunshinLogo className="w-24 h-24 text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        </div>

        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 tracking-tighter mb-4">
          404
        </h1>

        <div className="space-y-2 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide uppercase">
            {title}
          </h2>
          <p className="text-gray-400 max-w-md mx-auto text-lg">
            {description}
          </p>
        </div>

        <Link
          href="/"
          className="group relative px-8 py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(153,69,255,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative flex items-center gap-3 font-bold text-white tracking-widest uppercase text-sm">
            <House className="w-5 h-5" weight="duotone" />
            {action}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
        style={{ opacity: 0.05 }}
      />
    </div>
  );
}
