import Link from "next/link";
import { BunshinLogo } from "@/components/ui/BunshinLogo";
import { House, ArrowRight } from "@phosphor-icons/react/dist/ssr";
interface NotFoundHeroProps {
  title: string;
  description: string;
  action: string;
  code?: string;
}

export default function NotFoundHero({
  title,
  description,
  action,
  code,
}: NotFoundHeroProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative">

      <div className="relative z-10 flex flex-col items-center text-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-8">
          <BunshinLogo className="w-24 h-24 text-blue-500" />
        </div>

        <h1 className="text-8xl md:text-9xl font-black text-white/20 tracking-tighter mb-4">
          {code}
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
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-950 font-bold text-sm uppercase tracking-widest rounded-lg hover:bg-neutral-200 transition-colors"
        >
          <span className="flex items-center gap-3">
            <House className="w-5 h-5" weight="duotone" />
            {action}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>

      <div
        className="absolute inset-0"
        style={{}}
      />
    </div>
  );
}
