import React from 'react';

export function QuantityInput({ value = 1, onChange = () => {} }) {
  return (
    <div className="inline-flex items-center">
      <button onClick={() => onChange(value - 1)}>-</button>
      <input value={value} readOnly className="w-10 text-center" />
      <button onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}

export default QuantityInput;