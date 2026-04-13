"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}

export default function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-espresso" : "bg-pale-oak"
        }`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </div>
      {label && (
        <span className={`text-sm font-medium ${checked ? "text-espresso" : "text-warm-gray"}`}>
          {label}
        </span>
      )}
    </label>
  );
}
