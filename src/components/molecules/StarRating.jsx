import React from 'react';

export function StarRating({ rating = 0 }) {
  return <div>{'★'.repeat(Math.round(rating))}</div>;
}
