"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Warning, SpinnerGap } from "@phosphor-icons/react";
import { banUser, deleteUser } from "@/app/actions/admin";
import { cn } from "@/lib/utils";
import AdminConfirmInput from "./AdminConfirmInput";

type Props = {
  title: string;
  message: string;
  confirmLabel: string;
  variant: "danger" | "warning" | "primary";
  userId: string;
  action: "ban" | "delete";
  actionValue?: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AdminConfirmModal({
  title,
  message,
  confirmLabel,
  variant,
  userId,
  action,
  actionValue,
  onClose,
  onSuccess,
}: Props) {
  const t = useTranslations("Admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const requiresConfirmation = action === "delete";
  const deleteKeyword = t("Users.deleteKeyword");
  const isConfirmed = !requiresConfirmation || confirmText === deleteKeyword;

  const handleConfirm = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    setError(null);

    try {
      if (action === "ban") {
        await banUser(userId, actionValue ?? true);
      } else if (action === "delete") {
        await deleteUser(userId);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || t("Errors.actionFailed"));
    } finally {
      setLoading(false);
    }
  };

  const variantStyles = {
    danger: {
      icon: "bg-red-500/20 text-red-400",
      button: "bg-red-500 hover:bg-red-600",
      border: "border-red-500/30",
    },
    warning: {
      icon: "bg-orange-500/20 text-orange-400",
      button: "bg-orange-500 hover:bg-orange-600",
      border: "border-orange-500/30",
    },
    primary: {
      icon: "bg-brand-primary/20 text-brand-primary",
      button: "bg-brand-primary hover:bg-brand-secondary",
      border: "border-brand-primary/30",
    },
  };

  const styles = variantStyles[variant];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-md bg-surface-2 border rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200",
          styles.border,
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-xl", styles.icon)}>
              <Warning className="w-6 h-6" weight="fill" />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-300">{message}</p>
          {requiresConfirmation && (
            <AdminConfirmInput
              label={t("Users.typeDelete")}
              value={confirmText}
              placeholder={deleteKeyword}
              onChange={setConfirmText}
            />
          )}

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
            onClick={handleConfirm}
            disabled={loading || !isConfirmed}
            className={cn(
              "flex-1 py-3 rounded-xl font-bold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2",
              styles.button,
            )}
          >
            {loading ? (
              <SpinnerGap className="w-5 h-5 animate-spin" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
