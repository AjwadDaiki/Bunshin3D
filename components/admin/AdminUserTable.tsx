"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import AdminGrantCreditsModal from "./AdminGrantCreditsModal";
import AdminChangeRoleModal from "./AdminChangeRoleModal";
import AdminConfirmModal from "./AdminConfirmModal";
import AdminUserRow from "./AdminUserRow";
import { AdminUserProfile } from "./types";

type AdminUserTableProps = {
  users: AdminUserProfile[];
  onRefresh: () => void;
};

type ModalType = "credits" | "role" | "ban" | "delete" | null;

type RowAction = "credits" | "role" | "ban" | "delete";

export default function AdminUserTable({
  users,
  onRefresh,
}: AdminUserTableProps) {
  const t = useTranslations("Admin");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserProfile | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);

  const openModal = (user: AdminUserProfile, type: ModalType) => {
    setSelectedUser(user);
    setModalType(type);
    setActiveDropdown(null);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  const handleRowAction = (user: AdminUserProfile, action: RowAction) => {
    openModal(user, action);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-white/6">
        <table className="w-full text-sm">
          <thead className="bg-[#191919] text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">{t("Tables.colUser")}</th>
              <th className="px-6 py-4 text-left">{t("Users.role")}</th>
              <th className="px-6 py-4 text-left">{t("Tables.colDate")}</th>
              <th className="px-6 py-4 text-right">{t("Tables.colCredits")}</th>
              <th className="px-6 py-4 text-center">{t("Users.status")}</th>
              <th className="px-6 py-4 text-right">{t("Users.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {users.map((user) => (
              <AdminUserRow
                key={user.id}
                user={user}
                isActive={activeDropdown === user.id}
                onToggle={(id) =>
                  setActiveDropdown(activeDropdown === id ? null : id)
                }
                onAction={handleRowAction}
              />
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
    </>
  );
}

