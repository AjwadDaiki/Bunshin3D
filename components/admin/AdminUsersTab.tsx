"use client";

import { FormEvent } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import AdminUserTable from "./AdminUserTable";
import AdminPagination from "./AdminPagination";
import { AdminUserProfile } from "./types";

type Props = {
  users: AdminUserProfile[];
  userSearch: string;
  onSearchChange: (value: string) => void;
  onSearch: (event: FormEvent) => void;
  onRefresh: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function AdminUsersTab({
  users,
  userSearch,
  onSearchChange,
  onSearch,
  onRefresh,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const t = useTranslations("Admin");

  return (
    <div className="space-y-6">
      <form onSubmit={onSearch} className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={userSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("Users.searchPlaceholder")}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-secondary transition-colors"
        >
          {t("Users.search")}
        </button>
      </form>

      <AdminUserTable users={users} onRefresh={onRefresh} />

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

