import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/storefront/HomePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
