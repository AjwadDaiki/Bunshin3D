"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { X, CreditCard, SpinnerGap, EnvelopeSimple, Lightning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

const PACKS = [
  { id: "discovery", credits: 10 },
  { id: "creator", credits: 50 },
  { id: "studio", credits: 200 },
] as const;

export default function AdminSimulatePaymentModal({ onClose, onSuccess }: Props) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [targetEmail, setTargetEmail] = useState("");
  const [selectedPack, setSelectedPack] = useState<string>("discovery");
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{ id: string; email: string; credits: number }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string; credits: number } | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!targetEmail.trim()) return;
    setSearching(true);
    setError(null);

    try {
      const { getAllUsers } = await import("@/app/actions/admin");
      const result = await getAllUsers(1, 5, targetEmail.trim());
      setSearchResults(result.users.map((u: any) => ({ id: u.id, email: u.email, credits: u.credits || 0 })));
      if (result.users.length === 0) {
        setError(t("SimulatePayment.userNotFound"));
      }
    } catch {
      setError(t("Errors.fetchUsersFailed"));
    } finally {
      setSearching(false);
    }
  };

  // Direct simulation (bypass Stripe)
  const handleSimulate = async () => {
    if (!selectedUser) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/simulate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          packId: selectedPack,
          sendEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("Errors.actionFailed"));
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || t("Errors.actionFailed"));
    } finally {
      setLoading(false);
    }
  };

  // Real Stripe test checkout
  const handleStripeTest = async () => {
    setStripeLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/test-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packId: selectedPack,
          targetUserId: selectedUser?.id,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("Errors.actionFailed"));
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || t("Errors.actionFailed"));
    } finally {
      setStripeLoading(false);
    }
  };

  const selectedPackData = PACKS.find((p) => p.id === selectedPack)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#191919] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20">
              <CreditCard className="w-6 h-6 text-blue-400" weight="fill" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t("SimulatePayment.title")}
              </h3>
              <p className="text-sm text-zinc-400">
                {t("SimulatePayment.subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* User search */}
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">
              {t("SimulatePayment.searchUser")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetEmail}
                onChange={(e) => {
                  setTargetEmail(e.target.value);
                  setSelectedUser(null);
                  setSearchResults([]);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("Users.searchPlaceholder")}
                className="flex-1 px-4 py-2.5 bg-[#111] border border-white/6 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/12 transition-colors text-sm"
              />
              <button
                onClick={handleSearch}
                disabled={searching || !targetEmail.trim()}
                className="px-4 py-2.5 bg-[#222] border border-white/6 rounded-lg text-sm font-medium text-white hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
              >
                {searching ? <SpinnerGap className="w-4 h-4 animate-spin" /> : t("Users.search")}
              </button>
            </div>

            {searchResults.length > 0 && !selectedUser && (
              <div className="mt-2 border border-white/6 rounded-lg overflow-hidden">
                {searchResults.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className="w-full px-4 py-2.5 text-left hover:bg-white/5 transition-colors border-b border-white/6 last:border-b-0"
                  >
                    <p className="text-sm text-white">{u.email}</p>
                    <p className="text-xs text-zinc-500">{u.credits} {t("Users.credits")}</p>
                  </button>
                ))}
              </div>
            )}

            {selectedUser && (
              <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">{selectedUser.email}</p>
                  <p className="text-xs text-zinc-400">{selectedUser.credits} {t("Users.credits")}</p>
                </div>
                <button
                  onClick={() => { setSelectedUser(null); setSearchResults([]); }}
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  {t("SimulatePayment.change")}
                </button>
              </div>
            )}
          </div>

          {/* Pack selection */}
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">
              {t("SimulatePayment.selectPack")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => setSelectedPack(pack.id)}
                  className={cn(
                    "py-3 rounded-lg font-medium transition-all border text-sm",
                    selectedPack === pack.id
                      ? "bg-white text-neutral-950 border-white"
                      : "bg-[#111] border-white/6 text-zinc-300 hover:border-white/12",
                  )}
                >
                  <div className="font-bold">{pack.credits}</div>
                  <div className="text-xs opacity-70">{t(`SimulatePayment.packs.${pack.id}`)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Send email toggle (only for direct simulation) */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={cn(
                "w-10 h-6 rounded-full transition-colors relative",
                sendEmail ? "bg-blue-500" : "bg-[#333]",
              )}
              onClick={() => setSendEmail(!sendEmail)}
            >
              <div
                className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                  sendEmail ? "translate-x-5" : "translate-x-1",
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <EnvelopeSimple className="w-4 h-4 text-zinc-400" />
              <span className="text-sm text-zinc-300">{t("SimulatePayment.sendConfirmationEmail")}</span>
            </div>
          </label>

          {/* Info */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-300">
              {t("SimulatePayment.warning", { credits: selectedPackData.credits })}
            </p>
          </div>

          {/* Stripe test info */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-300">
              {t("SimulatePayment.stripeTestInfo")}
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 p-6 border-t border-white/6">
          {/* Row 1: Direct simulation */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-medium bg-[#191919] border border-white/6 text-zinc-300 hover:bg-[#222] transition-colors"
            >
              {t("Users.cancel")}
            </button>
            <button
              onClick={handleSimulate}
              disabled={loading || !selectedUser}
              className="flex-1 py-3 rounded-lg font-bold bg-white text-neutral-950 hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <SpinnerGap className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-5 h-5" weight="fill" />
                  {t("SimulatePayment.simulate")} +{selectedPackData.credits}
                </>
              )}
            </button>
          </div>

          {/* Row 2: Stripe test checkout */}
          <button
            onClick={handleStripeTest}
            disabled={stripeLoading}
            className="w-full py-3 rounded-lg font-bold bg-[#635bff] text-white hover:bg-[#5851db] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {stripeLoading ? (
              <SpinnerGap className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Lightning className="w-5 h-5" weight="fill" />
                {t("SimulatePayment.stripeTestCheckout")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
