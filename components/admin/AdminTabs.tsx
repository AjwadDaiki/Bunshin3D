"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  activeTab: "overview" | "users";
  onChange: (tab: "overview" | "users") => void;
};

export default function AdminTabs({ activeTab, onChange }: Props) {
  const t = useTranslations("Admin");

  return (
    <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
      <button
        onClick={() => onChange("overview")}
        className={cn(
          "px-6 py-2 rounded-lg text-sm font-medium transition-all",
          activeTab === "overview"
            ? "bg-brand-primary text-white"
            : "text-gray-400 hover:text-white",
        )}
      >
        {t("Tabs.overview")}
      </button>
      <button
        onClick={() => onChange("users")}
        className={cn(
          "px-6 py-2 rounded-lg text-sm font-medium transition-all",
          activeTab === "users"
            ? "bg-brand-primary text-white"
            : "text-gray-400 hover:text-white",
        )}
      >
        {t("Tabs.users")}
      </button>
    </div>
  );
}

