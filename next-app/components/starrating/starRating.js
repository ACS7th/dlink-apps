"use client";

import { useState } from "react";

export default function StarRating({ totalStars = 5, onChange }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRating = (value) => {
    if (rating === value) {
      setRating(0);
      if (onChange) onChange(0);
    } else {
      setRating(value);
      if (onChange) onChange(value);
    }
  };

  return (
    <div className="flex flex-row-reverse justify-end text-xl space-x-reverse space-x-0.5 ml-2">
      {Array.from({ length: totalStars }, (_, index) => {
        const value = totalStars - index;

        return (
          <label
            key={value}
            className={`
              cursor-pointer
              transition-colors duration-300
              ${(hover || rating) >= value
                ? "text-yellow-500"
                : "text-gray-400"
              }
            `}
            onClick={() => handleRating(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </label>
        );
      })}
    </div>
  );
}
