"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  DotsThreeVertical,
  Coins,
  UserCircleGear,
  Prohibit,
  Trash,
  Eye,
  Crown,
  ShieldCheck,
  User,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";
import AdminGrantCreditsModal from "./AdminGrantCreditsModal";
import AdminChangeRoleModal from "./AdminChangeRoleModal";
import AdminConfirmModal from "./AdminConfirmModal";
import AdminGenerationsModal from "./AdminGenerationsModal";

type UserProfile = {
  id: string;
  email: string;
  credits: number;
  created_at: string;
  is_admin?: boolean;
  is_moderator?: boolean;
  is_banned?: boolean;
  last_sign_in?: string;
};

type AdminUserTableProps = {
  users: UserProfile[];
  onRefresh: () => void;
};

export default function AdminUserTable({ users, onRefresh }: AdminUserTableProps) {
  const t = useTranslations("Admin");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [modalType, setModalType] = useState<
    "credits" | "role" | "ban" | "delete" | "inspect" | null
  >(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadge = (user: UserProfile) => {
    if (user.is_admin) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400">
          <Crown className="w-3 h-3" weight="fill" /> Admin
        </span>
      );
    }
    if (user.is_moderator) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400">
          <ShieldCheck className="w-3 h-3" weight="fill" /> Mod
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-500/20 text-gray-400">
        <User className="w-3 h-3" weight="fill" /> User
      </span>
    );
  };

  const openModal = (user: UserProfile, type: typeof modalType) => {
    setSelectedUser(user);
    setModalType(type);
    setActiveDropdown(null);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">{t("Tables.colUser")}</th>
              <th className="px-6 py-4 text-left">{t("Users.role")}</th>
              <th className="px-6 py-4 text-left">{t("Tables.colDate")}</th>
              <th className="px-6 py-4 text-right">{t("Tables.colCredits")}</th>
              <th className="px-6 py-4 text-center">{t("Users.status")}</th>
              <th className="px-6 py-4 text-right">{t("Users.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-xs font-bold">
                      {user.email?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-white truncate max-w-[200px]">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {user.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{getRoleBadge(user)}</td>
                <td className="px-6 py-4 text-gray-400">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-mono font-bold text-brand-primary">
                    {user.credits}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {user.is_banned ? (
                    <span className="inline-flex items-center gap-1 text-red-400">
                      <XCircle className="w-4 h-4" weight="fill" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-green-400">
                      <CheckCircle className="w-4 h-4" weight="fill" />
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === user.id ? null : user.id
                        )
                      }
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <DotsThreeVertical
                        className="w-5 h-5 text-gray-400"
                        weight="bold"
                      />
                    </button>

                    {activeDropdown === user.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-surface-2 border border-white/10 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <button
                          onClick={() => openModal(user, "credits")}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-3 text-gray-300"
                        >
                          <Coins className="w-4 h-4 text-amber-400" weight="fill" />
                          {t("Users.grantCredits")}
                        </button>
                        <button
                          onClick={() => openModal(user, "role")}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-3 text-gray-300"
                        >
                          <UserCircleGear className="w-4 h-4 text-blue-400" weight="fill" />
                          {t("Users.changeRole")}
                        </button>
                        <button
                          onClick={() => openModal(user, "inspect")}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-3 text-gray-300"
                        >
                          <Eye className="w-4 h-4 text-brand-primary" weight="fill" />
                          {t("Users.inspect")}
                        </button>
                        <div className="my-2 border-t border-white/10" />
                        <button
                          onClick={() => openModal(user, "ban")}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-3 text-orange-400"
                        >
                          <Prohibit className="w-4 h-4" weight="fill" />
                          {user.is_banned ? t("Users.unban") : t("Users.ban")}
                        </button>
                        <button
                          onClick={() => openModal(user, "delete")}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-red-500/10 transition-colors flex items-center gap-3 text-red-400"
                        >
                          <Trash className="w-4 h-4" weight="fill" />
                          {t("Users.delete")}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && modalType === "credits" && (
        <AdminGrantCreditsModal
          user={selectedUser}
          onClose={closeModal}
          onSuccess={onRefresh}
        />
      )}

      {selectedUser && modalType === "role" && (
        <AdminChangeRoleModal
          user={selectedUser}
          onClose={closeModal}
          onSuccess={onRefresh}
        />
      )}

      {selectedUser && modalType === "ban" && (
        <AdminConfirmModal
          title={selectedUser.is_banned ? t("Users.unbanTitle") : t("Users.banTitle")}
          message={
            selectedUser.is_banned
              ? t("Users.unbanMessage", { email: selectedUser.email })
              : t("Users.banMessage", { email: selectedUser.email })
          }
          confirmLabel={selectedUser.is_banned ? t("Users.unban") : t("Users.ban")}
          variant={selectedUser.is_banned ? "primary" : "warning"}
          userId={selectedUser.id}
          action="ban"
          actionValue={!selectedUser.is_banned}
          onClose={closeModal}
          onSuccess={onRefresh}
        />
      )}

      {selectedUser && modalType === "delete" && (
        <AdminConfirmModal
          title={t("Users.deleteTitle")}
          message={t("Users.deleteMessage", { email: selectedUser.email })}
          confirmLabel={t("Users.deleteConfirm")}
          variant="danger"
          userId={selectedUser.id}
          action="delete"
          onClose={closeModal}
          onSuccess={onRefresh}
        />
      )}

      {selectedUser && modalType === "inspect" && (
        <AdminGenerationsModal
          user={selectedUser}
          onClose={closeModal}
        />
      )}
    </>
  );
}
