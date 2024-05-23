import React from 'react';
import { App } from './pages';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';


export function Routing() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}