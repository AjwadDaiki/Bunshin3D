"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import HeaderBrand from "./header/HeaderBrand";
import HeaderNav from "./header/HeaderNav";
import HeaderUserMenu from "./header/HeaderUserMenu";
import HeaderAuthButton from "./header/HeaderAuthButton";
import HeaderMobileToggle from "./header/HeaderMobileToggle";
import HeaderMobileMenu from "./header/HeaderMobileMenu";
import { useHeaderUi } from "./header/useHeaderUi";
import { useHeaderSession } from "./header/useHeaderSession";

export default function HeaderNew() {
  const pathname = usePathname();
  const { user, credits, isAdmin, logout } = useHeaderSession();
  const {
    isOpen,
    userMenuOpen,
    scrolled,
    toggleMobile,
    toggleUserMenu,
    closeMenus,
  } = useHeaderUi();

  useEffect(() => {
    closeMenus();
  }, [closeMenus, pathname]);

  const safeCredits = credits ?? 0;

  return (
    <header
      className={cn(
        "left-0 right-0 transition-all duration-500 backdrop-blur-2xl bg-surface-1/80",
        scrolled && "shadow-lg border-b border-white/10",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <HeaderBrand />
          <HeaderNav pathname={pathname} isAdmin={isAdmin} />

          {user ? (
            <HeaderUserMenu
              credits={safeCredits}
              userMenuOpen={userMenuOpen}
              onToggleMenu={toggleUserMenu}
              onLogout={logout}
            />
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <HeaderAuthButton />
            </div>
          )}

          <HeaderMobileToggle isOpen={isOpen} onToggle={toggleMobile} />
        </div>

        <HeaderMobileMenu
          isOpen={isOpen}
          isAdmin={isAdmin}
          hasUser={!!user}
          credits={safeCredits}
          onLogout={logout}
        />
      </div>
    </header>
  );
}
