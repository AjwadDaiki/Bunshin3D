"use client";

import { Image as ImageIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { BunshinLogo } from "@/components/ui/BunshinLogo";
import StudioViewerOverlay from "./StudioViewerOverlay";

type Props = {
  modelUrl: string | null;
  generatedImageUrl: string | null;
  isGenerating: boolean;
  lastLogMessage?: string;
};

export default function StudioViewer({
  modelUrl,
  generatedImageUrl,
  isGenerating,
  lastLogMessage,
}: Props) {
  const t = useTranslations("Studio");

  return (
    <div className="glass-card rounded-3xl overflow-hidden bg-surface-2 border-white/10 relative h-[600px] flex items-center justify-center group">
      <StudioViewerOverlay isGenerating={isGenerating} />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {!modelUrl && !generatedImageUrl && !isGenerating && (
        <div className="text-center opacity-40 select-none pointer-events-none space-y-2">
          <BunshinLogo className="h-28 w-28 mx-auto text-white stroke-1" />
          <h3 className="text-2xl font-bold">{t("Interface.Viewer.waiting")}</h3>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            {t("Interface.Viewer.waitingStream")}
          </p>
        </div>
      )}

      {isGenerating && (
        <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="relative">
            <BunshinLogo className="h-32 w-32 text-brand-primary" animated />
          </div>
          <p className="mt-8 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary animate-pulse">
            {t("Interface.Viewer.creatingMagic")}
          </p>
          <p className="text-gray-400 mt-3 text-sm max-w-xs text-center font-mono">
            {lastLogMessage}
          </p>
        </div>
      )}

      {generatedImageUrl && !modelUrl && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
          <img
            src={generatedImageUrl}
            alt={t("Interface.Viewer.generated2D")}
            className="max-h-full max-w-full rounded-xl shadow-2xl object-contain"
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-brand-primary" weight="duotone" />
            {t("Interface.Viewer.referenceImage")}
          </div>
        </div>
      )}

      {modelUrl && (
        <model-viewer
          src={modelUrl}
          poster={generatedImageUrl || undefined}
          shadow-intensity="1"
          camera-controls
          auto-rotate
          ar
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
          }}
        >
          <div slot="progress-bar"></div>
        </model-viewer>
      )}
    </div>
  );
}
