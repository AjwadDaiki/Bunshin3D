"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  X,
  UserCircleGear,
  SpinnerGap,
  Crown,
  ShieldCheck,
  User,
} from "@phosphor-icons/react";
import { changeUserRole } from "@/app/actions/admin";
import { cn } from "@/lib/utils";
import AdminRoleOption from "./AdminRoleOption";

type Props = {
  user: {
    id: string;
    email: string;
    is_admin?: boolean;
    is_moderator?: boolean;
  };
  onClose: () => void;
  onSuccess: () => void;
};

const ROLES = [
  { value: "user", icon: User, color: "text-gray-400", bg: "bg-gray-500/20" },
  { value: "moderator", icon: ShieldCheck, color: "text-blue-400", bg: "bg-blue-500/20" },
  { value: "admin", icon: Crown, color: "text-amber-400", bg: "bg-amber-500/20" },
] as const;

export default function AdminChangeRoleModal({ user, onClose, onSuccess }: Props) {
  const t = useTranslations("Admin");

  const getCurrentRole = () => {
    if (user.is_admin) return "admin";
    if (user.is_moderator) return "moderator";
    return "user";
  };

  const [selectedRole, setSelectedRole] = useState<"user" | "moderator" | "admin">(
    getCurrentRole(),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangeRole = async () => {
    if (selectedRole === getCurrentRole()) {
      onClose();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await changeUserRole(user.id, selectedRole);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || t("Errors.changeRoleFailed"));
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
            <div className="p-2 rounded-xl bg-blue-500/20">
              <UserCircleGear className="w-6 h-6 text-blue-400" weight="fill" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t("Users.changeRole")}
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

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-400">{t("Users.selectRole")}</p>

          <div className="space-y-3">
            {ROLES.map(({ value, icon: Icon, color, bg }) => (
              <AdminRoleOption
                key={value}
                value={value}
                selected={selectedRole === value}
                onSelect={setSelectedRole}
                Icon={Icon}
                color={color}
                bg={bg}
              />
            ))}
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
            onClick={handleChangeRole}
            disabled={loading || selectedRole === getCurrentRole()}
            className="flex-1 py-3 rounded-xl font-bold bg-brand-primary text-white hover:bg-brand-secondary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <SpinnerGap className="w-5 h-5 animate-spin" />
            ) : (
              t("Users.saveRole")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
