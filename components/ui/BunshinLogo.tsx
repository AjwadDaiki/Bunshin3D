import Image from "next/image";
import { cn } from "@/lib/utils";

interface BunshinLogoProps {
  className?: string;
  animated?: boolean;
}

export const BunshinLogo = ({
  className,
  animated = false,
}: BunshinLogoProps) => {
  return (
    <div className={cn("relative select-none", className)}>
      <Image
        src="/icon-192.png"
        alt="Bunshin3D Logo"
        fill
        className={cn("object-contain", animated && "animate-logo-glow")}
        priority
      />
      {animated && (
        <div className="absolute inset-0 bg-brand-primary/40 blur-2xl rounded-full -z-10 animate-pulse-slow" />
      )}
    </div>
  );
};
