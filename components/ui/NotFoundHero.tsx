import { Link } from "@/i18n/routing";
import { BunshinLogo } from "@/components/ui/BunshinLogo";
import { House, ArrowRight } from "@phosphor-icons/react/dist/ssr";

type RecoveryItem = { href: string; label: string };

interface NotFoundHeroProps {
  title: string;
  description: string;
  action: string;
  code?: string;
  recoveryTitle?: string;
  recoveryItems?: RecoveryItem[];
}

export default function NotFoundHero({
  title,
  description,
  action,
  code,
  recoveryTitle,
  recoveryItems,
}: NotFoundHeroProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative py-24 px-4">
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-8">
          <BunshinLogo className="w-24 h-24 text-blue-500" />
        </div>

        <h1 className="text-8xl md:text-9xl font-black text-white/20 tracking-tighter mb-4">
          {code}
        </h1>

        <div className="space-y-2 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide uppercase">
            {title}
          </h2>
          <p className="text-gray-400 max-w-md mx-auto text-lg">
            {description}
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-950 font-bold text-sm uppercase tracking-widest rounded-lg hover:bg-neutral-200 transition-colors mb-12"
        >
          <span className="flex items-center gap-3">
            <House className="w-5 h-5" weight="duotone" />
            {action}
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        {recoveryItems && recoveryItems.length > 0 && (
          <div className="w-full">
            {recoveryTitle && (
              <p className="text-sm text-neutral-500 mb-4">{recoveryTitle}</p>
            )}
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {recoveryItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg border border-white/6 bg-[#111] px-4 py-3 text-sm text-neutral-300 transition-colors hover:border-white/12 hover:bg-[#161616] hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
