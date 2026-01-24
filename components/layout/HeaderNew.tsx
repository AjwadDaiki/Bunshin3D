"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Zap,
  CreditCard,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
// Import du logo personnalisé
import { BunshinLogo } from "../ui/BunshinLogo";

export default function HeaderNew() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchCredits = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();
    setCredits(data?.credits ?? 0);
  };

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchCredits(user.id);
    };
    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchCredits(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-surface-1/80 backdrop-blur-2xl border-b border-white/10 shadow-lg"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Bunshin3D Home"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full animate-pulse-slow"></div>
              {/* Remplacement de Sparkles par BunshinLogo */}
              <BunshinLogo className="relative h-8 w-8 text-brand-primary group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-gradient-brand">Bunshin</span>
              <span className="text-brand-accent">3D</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            <Link
              href="/studio"
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-primary",
                pathname === "/studio" ? "text-brand-primary" : "text-gray-300",
              )}
            >
              {t("studio")}
            </Link>
            <Link
              href="/pricing"
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-primary",
                pathname === "/pricing"
                  ? "text-brand-primary"
                  : "text-gray-300",
              )}
            >
              {t("pricing")}
            </Link>
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Credits Badge */}
                <Link
                  href="/pricing"
                  className="glass-button px-3 py-1.5 rounded-full flex items-center gap-2"
                  aria-label={`${credits ?? 0} credits available. Click to buy more credits`}
                >
                  <Zap
                    className={cn(
                      "h-4 w-4",
                      (credits ?? 0) > 5 ? "text-amber-400" : "text-red-400",
                    )}
                  />
                  <span className="text-sm font-bold">{credits ?? 0}</span>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="glass-button p-2 rounded-full hover:bg-white/15"
                    aria-label="User menu"
                    aria-haspopup="true"
                    aria-expanded={userMenuOpen}
                  >
                    <UserIcon className="h-5 w-5" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden"
                      role="menu"
                    >
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="text-sm">{t("dashboard")}</span>
                      </Link>
                      <Link
                        href="/pricing"
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 transition-colors"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm">Buy Credits</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-500/10 text-red-400 transition-colors"
                        aria-label="Logout from account"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">{t("logout")}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-brand-primary hover:bg-brand-secondary rounded-full text-sm font-medium transition-smooth"
              >
                {t("login")}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg glass-button"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass-card rounded-xl mt-2 p-4 mb-4">
            <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
              <Link href="/studio" className="text-sm font-medium">
                {t("studio")}
              </Link>
              <Link href="/pricing" className="text-sm font-medium">
                {t("pricing")}
              </Link>

              {user ? (
                <>
                  <div className="border-t border-white/10 my-2"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Credits</span>
                    <span className="text-sm font-bold">{credits ?? 0}</span>
                  </div>
                  <Link href="/account" className="text-sm font-medium">
                    {t("dashboard")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-400 text-left"
                    aria-label="Logout from account"
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-brand-primary"
                >
                  {t("login")}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
