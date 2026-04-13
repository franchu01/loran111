"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 24,
}: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <button
            key={star}
            type={readonly ? "button" : "button"}
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            className={`transition-transform duration-150 ${
              !readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"
            }`}
            aria-label={`${star} estrellas`}
          >
            <Star
              size={size}
              className={filled ? "text-espresso" : "text-pale-oak"}
              fill={filled ? "currentColor" : "currentColor"}
              strokeWidth={filled ? 0 : 1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
