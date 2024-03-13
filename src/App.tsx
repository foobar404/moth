import React from 'react';
import { Beta, Home } from './pages';
import mixpanel from 'mixpanel-browser';
import { ProtectedRoute } from './components';
import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';


mixpanel.init('d0fd76de4b27e761d97f59a0ca878094', { debug: true, track_pageview: true, persistence: 'localStorage' });


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
  )
}
