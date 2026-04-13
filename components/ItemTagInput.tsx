"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface ItemTagInputProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export default function ItemTagInput({
  items,
  onChange,
  placeholder = "Escribí un plato y presioná Enter",
}: ItemTagInputProps) {
  const [input, setInput] = useState("");

  function addItem() {
    const trimmed = input.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
    }
    setInput("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    } else if (e.key === "Backspace" && !input && items.length > 0) {
      onChange(items.slice(0, -1));
    }
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="border border-[#3C241540] rounded-xl bg-white p-3 min-h-12 focus-within:ring-2 focus-within:ring-espresso focus-within:border-transparent transition-all">
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1 bg-pale-oak text-espresso text-sm px-3 py-1 rounded-full font-medium"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-espresso/60 hover:text-espresso transition-colors"
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addItem}
        placeholder={items.length === 0 ? placeholder : "Agregar otro..."}
        className="w-full outline-none text-sm text-espresso placeholder:text-warm-gray bg-transparent"
      />
    </div>
  );
}
