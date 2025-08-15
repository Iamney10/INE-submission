import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import api, { setAuth } from './api.js';

export default function App(){
  const [me, setMe] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuth(token);
    api.get('/auth/me').then(({data}) => setMe(data));
  }, []);

  const onLogin = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setAuth(data.token);
    setMe(data.user);
  };

  const onRegister = async (email, password) => {
    const { data } = await api.post('/auth/register', { email, password });
    localStorage.setItem('token', data.token);
    setAuth(data.token);
    setMe(data.user);
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    setAuth(null);
    setMe(null);
    nav('/');
  };

  return (
    <>
      <Navbar me={me} onLogin={onLogin} onRegister={onRegister} onLogout={onLogout}/>
      <div className="container">
        <Outlet context={{ me }} />
      </div>
    </>
  );
}
