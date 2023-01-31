import React from 'react';
import { Home } from './pages/Home/index';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';


export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moth" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
