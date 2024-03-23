import React from 'react';
import { Beta, App, Key } from './pages';
import { ProtectedRoute } from './components';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


export function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/beta" element={<Beta />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<App />} />
          <Route path="/key" element={<Key />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
