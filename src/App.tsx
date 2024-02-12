import React from 'react';
import mixpanel from 'mixpanel-browser';
import { Home } from './pages/Home/index';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
 

mixpanel.init('d0fd76de4b27e761d97f59a0ca878094', {debug: true, track_pageview: true, persistence: 'localStorage'});
 

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
