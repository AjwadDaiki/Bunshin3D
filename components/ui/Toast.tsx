"use client";

import { useEffect, useState } from "react";
import { X, WarningCircle, CheckCircle, Info } from "@phosphor-icons/react";

type ToastType = "error" | "success" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  type = "info",
  onClose,
  duration = 5000,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    error: <WarningCircle className="h-5 w-5 text-red-400" weight="fill" />,
    success: <CheckCircle className="h-5 w-5 text-emerald-400" weight="fill" />,
    info: <Info className="h-5 w-5 text-blue-400" weight="fill" />,
  };

  const borders = {
    error: "border-red-500/30",
    success: "border-emerald-500/30",
    info: "border-blue-500/30",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-9999 flex items-center gap-3 rounded-xl border ${borders[type]} bg-zinc-950/95 px-4 py-3 shadow-2xl backdrop-blur-xl transition-all duration-300 max-w-md ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      {icons[type]}
      <p className="text-sm text-white flex-1">{message}</p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-white/10 hover:text-white"
      >
        <X className="h-3.5 w-3.5" weight="bold" />
      </button>
    </div>
  );
}
