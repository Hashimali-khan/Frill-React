import React from 'react';

export function Badge({ color = 'gray', size = 'md', children }) {
  return <span className={`inline-block px-2 py-1 text-${size} bg-${color}-200 rounded`}>{children}</span>;
}
