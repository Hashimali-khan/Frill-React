import React from 'react';

export function ColorSwatch({ color = '#000' }) {
  return <span className="inline-block w-6 h-6 rounded-full" style={{ backgroundColor: color }} />;
}
