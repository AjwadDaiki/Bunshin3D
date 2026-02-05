"use client";

import { useRef } from "react";
import { UploadSimple } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

type Props = {
  imagePreview: string | null;
  onFileSelect: (file: File | null) => void;
};

export default function StudioImageInput({ imagePreview, onFileSelect }: Props) {
  const t = useTranslations("Studio");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  };

  return (
    <>
      <label className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
        {t("Interface.DropZone.title")}
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full aspect-video border-2 border-dashed border-white/10 rounded-xl bg-[#111] flex flex-col items-center justify-center cursor-pointer hover:border-white/20 transition-all group overflow-hidden relative"
      >
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt={t("Interface.DropZone.previewAlt")}
            fill
            className="object-cover"
          />
        ) : (
          <>
            <div className="p-4 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors mb-3">
              <UploadSimple className="h-6 w-6 text-neutral-400" weight="bold" />
            </div>
            <p className="text-neutral-500 text-sm font-medium">
              {t("Interface.DropZone.subtitle")}
            </p>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </>
  );
}
