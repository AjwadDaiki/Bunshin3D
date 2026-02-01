"use client";

type Props = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export default function AdminConfirmInput({
  label,
  value,
  placeholder,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-400">{label}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors font-mono"
      />
    </div>
  );
}

