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
    <div className="bg-[#111] border border-white/6 rounded-xl overflow-hidden relative h-[600px] flex items-center justify-center group">
      <StudioViewerOverlay isGenerating={isGenerating} />

      {!modelUrl && !generatedImageUrl && !isGenerating && (
        <div className="text-center opacity-40 select-none pointer-events-none space-y-2">
          <BunshinLogo className="h-28 w-28 mx-auto text-white stroke-1" />
          <h3 className="text-2xl font-bold text-white">{t("Interface.Viewer.waiting")}</h3>
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            {t("Interface.Viewer.waitingStream")}
          </p>
        </div>
      )}

      {isGenerating && (
        <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center">
          <div className="relative">
            <BunshinLogo className="h-32 w-32 text-white" animated />
          </div>
          <p className="mt-8 text-2xl font-bold text-white animate-pulse">
            {t("Interface.Viewer.creatingMagic")}
          </p>
          <p className="text-neutral-400 mt-3 text-sm max-w-xs text-center font-mono">
            {lastLogMessage}
          </p>
        </div>
      )}

      {generatedImageUrl && !modelUrl && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
          <img
            src={generatedImageUrl}
            alt={t("Interface.Viewer.generated2D")}
            className="max-h-full max-w-full rounded-xl object-contain"
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-4 py-2 rounded-lg text-sm font-medium border border-white/6 flex items-center gap-2 text-neutral-300">
            <ImageIcon className="h-4 w-4 text-white" weight="duotone" />
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
