import Image from "next/image";
import { createTranslator } from "next-intl";
import messages from "@/messages/en.json";
import { cn } from "@/lib/utils";

interface BunshinLogoProps {
  className?: string;
  animated?: boolean;
}

export const BunshinLogo = ({
  className,
  animated = false,
}: BunshinLogoProps) => {
  const t = createTranslator({ locale: "en", messages, namespace: "Common" });

  return (
    <div className={cn("relative select-none", className)}>
      <Image
        src="/icon-192.png"
        alt={t("brandLogoAlt")}
        fill
        sizes="(max-width: 768px) 96px, 128px"
        className="object-contain"
        priority
      />
    </div>
  );
};
