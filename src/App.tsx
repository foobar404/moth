import React from 'react';
import { Beta, Home } from './pages';
import { ProtectedRoute } from './components';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/beta" element={<Beta />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
