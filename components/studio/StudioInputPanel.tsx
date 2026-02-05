"use client";

import { Mode } from "./types";
import StudioImageInput from "./StudioImageInput";
import StudioTextInput from "./StudioTextInput";
import StudioGenerateButton from "./StudioGenerateButton";

type Props = {
  mode: Mode;
  imagePreview: string | null;
  prompt: string;
  isGenerating: boolean;
  canGenerate: boolean;
  onFileSelect: (file: File | null) => void;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
};

export default function StudioInputPanel({
  mode,
  imagePreview,
  prompt,
  isGenerating,
  canGenerate,
  onFileSelect,
  onPromptChange,
  onGenerate,
}: Props) {
  return (
    <div className="bg-[#111] border border-white/6 rounded-xl p-6">
      {mode === "image" ? (
        <StudioImageInput imagePreview={imagePreview} onFileSelect={onFileSelect} />
      ) : (
        <StudioTextInput
          prompt={prompt}
          onChange={onPromptChange}
          disabled={isGenerating}
        />
      )}

      <StudioGenerateButton
        isGenerating={isGenerating}
        canGenerate={canGenerate}
        onGenerate={onGenerate}
      />
    </div>
  );
}
