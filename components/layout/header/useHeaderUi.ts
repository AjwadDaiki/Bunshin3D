"use client";

import { useCallback, useEffect, useState } from "react";

export function useHeaderUi() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobile = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setUserMenuOpen((prev) => !prev);
  }, []);

  const closeMenus = useCallback(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, []);

  return {
    isOpen,
    userMenuOpen,
    scrolled,
    toggleMobile,
    toggleUserMenu,
    closeMenus,
  };
}
