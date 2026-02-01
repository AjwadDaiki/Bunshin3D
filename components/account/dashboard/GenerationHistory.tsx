"use client";

import { ArrowClockwise, Cube } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import GenerationCard from "./GenerationCard";
import { Generation } from "../types";

type Props = {
  generations: Generation[];
  page: number;
  onPageChange: (page: number) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  onDelete: (id: string) => Promise<void>;
};

export default function GenerationHistory({
  generations,
  page,
  onPageChange,
  isRefreshing,
  onRefresh,
  onDelete,
}: Props) {
  const t = useTranslations("Account");
  const tCommon = useTranslations("Common");
  const itemsPerPage = 12;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGenerations = generations.slice(startIndex, endIndex);
  const totalPages = Math.ceil(generations.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-white">{t("History.title")}</h2>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 glass-button rounded-lg text-sm text-gray-400 hover:text-white disabled:opacity-50"
        >
          <ArrowClockwise
            className={cn("w-4 h-4", isRefreshing && "animate-spin")}
            weight="bold"
          />
        </button>
      </div>
      <p className="text-xs text-zinc-500">{t("History.retentionNotice")}</p>

      {generations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
            <Cube className="w-8 h-8 text-zinc-600" weight="duotone" />
          </div>
          <h3 className="text-lg font-medium text-white">{t("History.emptyTitle")}</h3>
          <p className="text-zinc-500 mb-6">{t("History.emptyDesc")}</p>
          <Link
            href="/studio"
            className="px-6 py-2 rounded-full bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors"
          >
            {t("History.emptyBtn")}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGenerations.map((gen) => (
              <GenerationCard
                key={gen.id}
                generation={gen}
                formatDate={formatDate}
                onDelete={onDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 glass-button rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tCommon("previous")}
              </button>
              <span className="px-4 py-2 text-gray-400">
                {tCommon("pageOf", { page, total: totalPages })}
              </span>
              <button
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 glass-button rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tCommon("next")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
