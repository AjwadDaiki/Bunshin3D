"use client";

import StudioHeader from "./StudioHeader";
import StudioModeToggle from "./StudioModeToggle";
import StudioQualitySelector from "./StudioQualitySelector";
import StudioInputPanel from "./StudioInputPanel";
import StudioLogsPanel from "./StudioLogsPanel";
import StudioViewer from "./StudioViewer";
import StudioExportPanel from "./StudioExportPanel";
import StudioPromptSamples from "./StudioPromptSamples";
import StudioCreditsPrompt from "./StudioCreditsPrompt";
import OTOPopup from "./OTOPopup";
import { useStudioUser } from "./useStudioUser";
import { useStudioState } from "./useStudioState";
import { useStudioLogs } from "./useStudioLogs";
import { useStudioGeneration } from "./useStudioGeneration";
import { useModelDownload, DownloadFormat } from "@/hooks/useModelDownload";
import { useOTO } from "@/components/providers/OTOProvider";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function StudioInterface() {
  const { credits, setCredits, userId } = useStudioUser();
  const { isOfferActive, timeRemaining, triggerOffer, offerStartedAt } = useOTO();
  const [otoOpen, setOtoOpen] = useState(false);
  const {
    mode,
    setMode,
    quality,
    setQuality,
    imageFile,
    imagePreview,
    prompt,
    setPrompt,
    isGenerating,
    setIsGenerating,
    modelUrl,
    setModelUrl,
    generatedImageUrl,
    setGeneratedImageUrl,
    handleFileChange,
    buildFilePath,
  } = useStudioState();
  const { logs, addLog, clearLogs, logsContainerRef } = useStudioLogs();
  const t = useTranslations("Studio");
  const [creditsPromptOpen, setCreditsPromptOpen] = useState(false);

  const { handleGenerate } = useStudioGeneration({
    mode,
    quality,
    imageFile,
    prompt,
    userId,
    credits,
    onInsufficientCredits: () => {
      if (!offerStartedAt && credits === 0) {
        // First time reaching 0 credits: trigger the 24h promo and show OTO popup
        triggerOffer();
        setOtoOpen(true);
      } else {
        // Already triggered before (or promo expired): show normal credits prompt
        // StudioCreditsPrompt will show promo prices if the offer is still active
        setCreditsPromptOpen(true);
      }
    },
    setCredits,
    setGeneratedImageUrl,
    setModelUrl,
    setIsGenerating,
    addLog,
    clearLogs,
    buildFilePath,
  });

  const { downloadModel, isDownloading, downloadFormat } = useModelDownload({
    onSuccess: (fmt) =>
      addLog(t("Logs.downloadSuccess", { format: fmt }), "success"),
    onError: (err) => addLog(t("Logs.downloadError", { error: err }), "error"),
  });

  const costInCredits = quality === "premium" ? 5 : 1;
  const canGenerate = credits >= costInCredits;
  const hasInput =
    mode === "image" ? Boolean(imagePreview) : Boolean(prompt.trim());

  const handleDownload = (format: DownloadFormat) => {
    if (modelUrl) downloadModel(modelUrl, format);
  };

  const lastLogMessage = logs[logs.length - 1]?.message;

  return (
    <div className="min-h-screen pt-16 pb-16 px-4">
      <div className="container mx-auto max-w-[1600px]">
        <StudioHeader credits={credits} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit">
            <StudioModeToggle mode={mode} onChange={setMode} />
            <StudioQualitySelector quality={quality} onChange={setQuality} />
            <StudioInputPanel
              mode={mode}
              imagePreview={imagePreview}
              prompt={prompt}
              isGenerating={isGenerating}
              canGenerate={canGenerate}
              onFileSelect={handleFileChange}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
            />
            {mode === "text" && (
              <StudioPromptSamples onSelect={setPrompt} />
            )}
            <StudioLogsPanel
              logs={logs}
              isGenerating={isGenerating}
              logsContainerRef={logsContainerRef}
            />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6 h-full">
            <StudioViewer
              modelUrl={modelUrl}
              generatedImageUrl={generatedImageUrl}
              isGenerating={isGenerating}
              lastLogMessage={lastLogMessage}
            />
            <StudioExportPanel
              modelUrl={modelUrl}
              isDownloading={isDownloading}
              downloadFormat={downloadFormat}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </div>
      <StudioCreditsPrompt
        open={creditsPromptOpen}
        requiredCredits={costInCredits}
        isPromoActive={isOfferActive}
        onClose={() => setCreditsPromptOpen(false)}
      />
      <OTOPopup
        open={otoOpen}
        timeRemaining={timeRemaining}
        userId={userId}
        onClose={() => setOtoOpen(false)}
      />
    </div>
  );
}
