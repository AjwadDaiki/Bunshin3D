"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CreditCard } from "@phosphor-icons/react";
import AdminSimulatePaymentModal from "./AdminSimulatePaymentModal";

type Props = {
  onRefresh: () => void;
};

export default function AdminOverviewTab({ onRefresh }: Props) {
  const t = useTranslations("Admin");
  const [showSimulate, setShowSimulate] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-white/6 bg-[#111] p-8">
        <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-xl border border-white/6 bg-[#191919] gap-6">
          <div>
            <h3 className="font-bold text-lg text-white">
              {t("SimulatePayment.title")}
            </h3>
            <p className="text-neutral-400 text-sm mt-1 max-w-xl">
              {t("SimulatePayment.description")}
            </p>
          </div>
          <button
            onClick={() => setShowSimulate(true)}
            className="flex items-center gap-2 px-8 py-4 rounded-lg font-bold transition-colors border shrink-0 bg-white text-neutral-950 border-white hover:bg-zinc-200"
          >
            <CreditCard className="w-5 h-5" weight="bold" />
            {t("SimulatePayment.simulate")}
          </button>
        </div>
      </div>

      {showSimulate && (
        <AdminSimulatePaymentModal
          onClose={() => setShowSimulate(false)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}
