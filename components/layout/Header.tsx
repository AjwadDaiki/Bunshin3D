"use client";

import React, { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

import {
  Sparkles,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Zap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
      if (user) await fetchCredits(user.id);
      setLoading(false);
    };
    initAuth();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) await fetchCredits(session.user.id);
        else setCredits(null);
      },
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const navLinks = [
    { href: "/studio", label: t("studio") },
    { href: "/pricing", label: t("pricing") },
  ];
  if (pathname === "/studio" || pathname.includes("/studio")) {
    return null;
  }
  return (
    <>
      <header
        className={cn(
          "fixed top-6 inset-x-0 z-50 flex justify-center transition-all duration-700",
          scrolled ? "px-12" : "px-4",
        )}
      >
        <div
          className={cn(
            "relative w-full max-w-5xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
            scrolled
              ? "glass-panel rounded-full py-3 px-6 bg-zinc-950/40 border-white/5 shadow-2xl backdrop-blur-md"
              : "bg-transparent py-6",
          )}
        >
          <div className="flex items-center justify-between">
            {/* LOGO - ORGANIQUE */}
            <Link href="/" className="flex items-center gap-3 group pl-2">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Sparkles className="relative w-6 h-6 text-white transition-transform group-hover:rotate-12 duration-500" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white/90">
                {t("brandName")}
              </span>
            </Link>

            {/* NAV - MINIMALISTE */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                    pathname === link.href
                      ? "text-white bg-white/5"
                      : "text-zinc-400 hover:text-white",
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  {pathname === link.href && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* ACTIONS - FUTURISTE */}
            <div className="hidden md:flex items-center gap-3">
              {!loading && user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                  <div className="flex items-center gap-2 bg-zinc-900/50 rounded-full px-4 py-1.5 border border-white/5">
                    <Zap
                      className={cn(
                        "w-3 h-3",
                        (credits || 0) > 0 ? "text-amber-400" : "text-red-400",
                      )}
                    />
                    <span className="text-xs font-mono font-bold text-zinc-300">
                      {credits}
                    </span>
                  </div>

                  <Link
                    href="/account"
                    className="group relative w-10 h-10 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-300"
                  >
                    <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <LayoutDashboard className="w-4 h-4 text-zinc-400 group-hover:text-white relative z-10" />
                  </Link>
                </div>
              ) : (
                !loading && (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/login"
                      className="text-sm font-medium text-zinc-400 hover:text-white px-3 transition-colors"
                    >
                      {t("login")}
                    </Link>
                    <Link
                      href="/login"
                      className="group relative px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold overflow-hidden transition-all hover:scale-105"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {t("start")}{" "}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-white to-indigo-200 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                    </Link>
                  </div>
                )
              )}
            </div>

            {/* MOBILE TRIGGER */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE OVERLAY */}
        {isOpen && (
          <div className="absolute top-24 inset-x-4 p-6 glass-panel rounded-3xl md:hidden animate-in fade-in slide-in-from-top-4 duration-300 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-white/80 py-2 border-b border-white/5"
              >
                {link.label}
              </Link>
            ))}
            {!loading && !user && (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-white text-black rounded-xl text-center font-bold mt-4"
              >
                {t("start")}
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
