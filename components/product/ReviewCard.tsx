'use client';

import React from 'react';
import RatingStars from './RatingStars';
import { ThumbsUp, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  helpful: string[];
  verified: boolean;
  createdAt: string;
}

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  onHelpful?: (reviewId: string) => void;
}

export default function ReviewCard({ review, currentUserId, onHelpful }: ReviewCardProps) {
  const isHelpful = currentUserId ? review.helpful.includes(currentUserId) : false;
  const helpfulCount = review.helpful.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleHelpful = async () => {
    if (!currentUserId) {
      toast.error('Please login to mark reviews as helpful');
      return;
    }

    if (onHelpful) {
      onHelpful(review._id);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {review.user.name.charAt(0).toUpperCase()}
          </div>
          
          {/* User Info */}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-800">{review.user.name}</h4>
              {review.verified && (
                <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {/* Rating */}
        <RatingStars rating={review.rating} size="small" />
      </div>

      {/* Title */}
      {review.title && (
        <h5 className="font-semibold text-gray-800 mb-2">{review.title}</h5>
      )}

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:scale-110 transition-transform cursor-pointer"
            />
          ))}
        </div>
      )}

      {/* Helpful Button */}
      <div className="flex items-center gap-2 pt-4 border-t">
        <button
          onClick={handleHelpful}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            isHelpful
              ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
              : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">
            Helpful {helpfulCount > 0 && `(${helpfulCount})`}
          </span>
        </button>
      </div>
    </div>
  );
}
