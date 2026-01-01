'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  showCount?: boolean;
  count?: number;
}

export default function RatingStars({
  rating,
  size = 'medium',
  readonly = true,
  onRatingChange,
  showCount = false,
  count = 0,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  const starSize = sizeClasses[size];

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => {
        const isFilled = value <= Math.floor(displayRating);
        const isHalf = value === Math.ceil(displayRating) && displayRating % 1 !== 0;

        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`relative ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            {/* Background star (empty) */}
            <Star
              className={`${starSize} text-gray-300`}
              fill="currentColor"
            />
            
            {/* Foreground star (filled) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: isFilled ? '100%' : isHalf ? '50%' : '0%' }}
            >
              <Star
                className={`${starSize} text-amber-400`}
                fill="currentColor"
              />
            </div>
          </button>
        );
      })}
      
      {showCount && count > 0 && (
        <span className="text-sm text-gray-600 ml-1">
          ({count})
        </span>
      )}
    </div>
  );
}
