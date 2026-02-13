"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Tag, SpinnerGap, Clock, Trash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

const OTO_DURATION_MS = 24 * 60 * 60 * 1000;

const DURATIONS = [
  { id: "24", hours: 24 },
  { id: "48", hours: 48 },
  { id: "72", hours: 72 },
  { id: "168", hours: 168 },
] as const;

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "0h";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
  return `${hours}h ${minutes}m`;
}

export default function AdminApplyPromoModal({ onClose, onSuccess }: Props) {
  const t = useTranslations("Admin");
  const [targetEmail, setTargetEmail] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<string>("24");
  const [customHours, setCustomHours] = useState("");
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{ id: string; email: string; credits: number; special_offer_started_at: string | null }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string; credits: number; special_offer_started_at: string | null } | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!targetEmail.trim()) return;
    setSearching(true);
    setError(null);

    try {
      const { getAllUsers } = await import("@/app/actions/admin");
      const result = await getAllUsers(1, 5, targetEmail.trim());
      setSearchResults(result.users.map((u: any) => ({
        id: u.id,
        email: u.email,
        credits: u.credits || 0,
        special_offer_started_at: u.special_offer_started_at || null,
      })));
      if (result.users.length === 0) {
        setError(t("SimulatePayment.userNotFound"));
      }
    } catch {
      setError(t("Errors.fetchUsersFailed"));
    } finally {
      setSearching(false);
    }
  };

  const getPromoStatus = (startedAt: string | null): { active: boolean; remaining: number } => {
    if (!startedAt) return { active: false, remaining: 0 };
    const start = new Date(startedAt).getTime();
    const end = start + OTO_DURATION_MS;
    const remaining = end - Date.now();
    return { active: remaining > 0, remaining: Math.max(0, remaining) };
  };

  const handleApply = async () => {
    if (!selectedUser) return;
    setLoading(true);
    setError(null);

    const hours = selectedDuration === "custom"
      ? Number(customHours) || 24
      : DURATIONS.find((d) => d.id === selectedDuration)?.hours || 24;

    try {
      const response = await fetch("/api/admin/apply-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          durationHours: hours,
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

  const handleRemove = async () => {
    if (!selectedUser) return;
    setRemoving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/apply-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          remove: true,
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
      setRemoving(false);
    }
  };

  const promoStatus = selectedUser ? getPromoStatus(selectedUser.special_offer_started_at) : null;

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
              <Tag className="w-6 h-6 text-blue-400" weight="fill" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t("ApplyPromo.title")}
              </h3>
              <p className="text-sm text-zinc-400">
                {t("ApplyPromo.subtitle")}
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

          {/* Current promo status */}
          {selectedUser && promoStatus && (
            <div className={cn(
              "p-3 rounded-lg border",
              promoStatus.active
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-[#111] border-white/6",
            )}>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">{t("ApplyPromo.currentStatus")}</span>
              </div>
              {promoStatus.active ? (
                <p className="text-sm text-emerald-400 font-medium">
                  {t("ApplyPromo.promoActive", { time: formatTimeRemaining(promoStatus.remaining) })}
                </p>
              ) : (
                <p className="text-sm text-zinc-500">{t("ApplyPromo.promoInactive")}</p>
              )}
            </div>
          )}

          {/* Duration selection */}
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">
              {t("ApplyPromo.selectDuration")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDuration(d.id)}
                  className={cn(
                    "py-3 rounded-lg font-medium transition-all border text-sm",
                    selectedDuration === d.id
                      ? "bg-white text-neutral-950 border-white"
                      : "bg-[#111] border-white/6 text-zinc-300 hover:border-white/12",
                  )}
                >
                  {t(`ApplyPromo.durations.${d.id}`)}
                </button>
              ))}
              <button
                onClick={() => setSelectedDuration("custom")}
                className={cn(
                  "py-3 rounded-lg font-medium transition-all border text-sm col-span-2",
                  selectedDuration === "custom"
                    ? "bg-white text-neutral-950 border-white"
                    : "bg-[#111] border-white/6 text-zinc-300 hover:border-white/12",
                )}
              >
                {t("ApplyPromo.durations.custom")}
              </button>
            </div>

            {selectedDuration === "custom" && (
              <div className="mt-2">
                <input
                  type="number"
                  min="1"
                  max="8760"
                  value={customHours}
                  onChange={(e) => setCustomHours(e.target.value)}
                  placeholder={t("ApplyPromo.customHours")}
                  className="w-full px-4 py-2.5 bg-[#111] border border-white/6 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/12 transition-colors text-sm"
                />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-300">
              {t("ApplyPromo.warning")}
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 p-6 border-t border-white/6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-medium bg-[#191919] border border-white/6 text-zinc-300 hover:bg-[#222] transition-colors"
            >
              {t("Users.cancel")}
            </button>
            <button
              onClick={handleApply}
              disabled={loading || !selectedUser}
              className="flex-1 py-3 rounded-lg font-bold bg-white text-neutral-950 hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <SpinnerGap className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Tag className="w-5 h-5" weight="fill" />
                  {t("ApplyPromo.apply")}
                </>
              )}
            </button>
          </div>

          {/* Remove promotion button */}
          {selectedUser && promoStatus?.active && (
            <button
              onClick={handleRemove}
              disabled={removing}
              className="w-full py-3 rounded-lg font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {removing ? (
                <SpinnerGap className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Trash className="w-5 h-5" />
                  {t("ApplyPromo.remove")}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
