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
      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
        {t("Interface.DropZone.title")}
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full aspect-video border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-white/5 transition-all group overflow-hidden relative"
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
            <div className="p-4 rounded-full bg-white/5 group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-colors mb-3">
              <UploadSimple className="h-6 w-6" weight="bold" />
            </div>
            <p className="text-gray-500 text-sm font-medium">
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
