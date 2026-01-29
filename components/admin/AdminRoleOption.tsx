"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type RoleValue = "user" | "moderator" | "admin";

type Props = {
  value: RoleValue;
  selected: boolean;
  onSelect: (value: RoleValue) => void;
  Icon: React.ComponentType<{ className?: string; weight?: "fill" }>;
  color: string;
  bg: string;
};

export default function AdminRoleOption({
  value,
  selected,
  onSelect,
  Icon,
  color,
  bg,
}: Props) {
  const t = useTranslations("Admin");

  return (
    <button
      onClick={() => onSelect(value)}
      className={cn(
        "w-full p-4 rounded-xl border transition-all flex items-center gap-4",
        selected
          ? "border-brand-primary bg-brand-primary/10"
          : "border-white/10 bg-white/5 hover:bg-white/10",
      )}
    >
      <div className={cn("p-2 rounded-lg", bg)}>
        <Icon className={cn("w-5 h-5", color)} weight="fill" />
      </div>
      <div className="text-left">
        <p className="font-medium text-white capitalize">
          {t(`Users.roles.${value}`)}
        </p>
        <p className="text-xs text-gray-400">
          {t(`Users.roleDesc.${value}`)}
        </p>
      </div>
      {selected && (
        <div className="ml-auto w-3 h-3 rounded-full bg-brand-primary" />
      )}
    </button>
  );
}

