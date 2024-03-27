import React from 'react';
import { App } from './pages';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


export function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
