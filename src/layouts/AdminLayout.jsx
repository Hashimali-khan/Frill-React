import React from 'react';

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <aside className="w-64 p-4 border-r">Admin</aside>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
