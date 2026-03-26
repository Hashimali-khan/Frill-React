import React from 'react';

export function Button({ variant = 'primary', children, ...props }) {
  const base = 'px-4 py-2 rounded';
  const variants = {
    primary: 'bg-black text-white',
    secondary: 'bg-gray-200 text-black',
    magenta: 'bg-magenta text-white',
    ghost: 'bg-transparent',
  };
  return (
    <button className={`${base} ${variants[variant] || variants.primary}`} {...props}>
      {children}
    </button>
  );
}
