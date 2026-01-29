"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Coins, SpinnerGap } from "@phosphor-icons/react";
import { grantCredits } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

type Props = {
  user: { id: string; email: string; credits: number };
  onClose: () => void;
  onSuccess: () => void;
};

const CREDIT_OPTIONS = [5, 10, 25, 50, 100, 500];

export default function AdminGrantCreditsModal({ user, onClose, onSuccess }: Props) {
  const t = useTranslations("Admin");
  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGrant = async () => {
    const finalAmount = customAmount ? parseInt(customAmount, 10) : amount;
    if (!finalAmount || finalAmount <= 0) return;

    setLoading(true);
    setError(null);

    try {
      await grantCredits(user.id, finalAmount);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || t("Errors.grantCreditsFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-surface-2 border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20">
              <Coins className="w-6 h-6 text-amber-400" weight="fill" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t("Users.grantCredits")}
              </h3>
              <p className="text-sm text-gray-400 truncate max-w-[250px]">
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-gray-400 mb-1">{t("Users.currentCredits")}</p>
            <p className="text-3xl font-bold text-brand-primary">{user.credits}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-3">{t("Users.selectAmount")}</p>
            <div className="grid grid-cols-3 gap-2">
              {CREDIT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setAmount(opt);
                    setCustomAmount("");
                  }}
                  className={cn(
                    "py-3 rounded-xl font-bold transition-all border",
                    amount === opt && !customAmount
                      ? "bg-brand-primary border-brand-primary text-white"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  )}
                >
                  +{opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">{t("Users.customAmount")}</p>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder={t("Users.customAmountPlaceholder")}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-medium bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
          >
            {t("Users.cancel")}
          </button>
          <button
            onClick={handleGrant}
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-bold bg-brand-primary text-white hover:bg-brand-secondary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <SpinnerGap className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Coins className="w-5 h-5" weight="fill" />
                {t("Users.grant")} +{customAmount || amount}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
