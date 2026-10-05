import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating, setRating, size = 18, clickable = false }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating
              ? 'text-amber-400 fill-amber-400'
              : 'text-slate-300 dark:text-slate-600'
          } ${clickable ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => clickable && setRating && setRating(star)}
        />
      ))}
    </div>
  );
};

export default RatingStars;
