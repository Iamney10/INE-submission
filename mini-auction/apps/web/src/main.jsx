import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import CreateAuction from './pages/CreateAuction.jsx';
import AuctionRoom from './pages/AuctionRoom.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Admin from './pages/Admin.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route element={<App />}>
        <Route index element={<Home/>} />
        <Route path="create" element={<CreateAuction/>} />
        <Route path="auction/:id" element={<AuctionRoom/>} />
        <Route path="dashboard" element={<Dashboard/>} />
        <Route path="admin" element={<Admin/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
