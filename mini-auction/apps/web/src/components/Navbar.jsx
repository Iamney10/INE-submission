import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ me, onLogin, onRegister, onLogout }){
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  return (
    <div className="row" style={{padding:'12px 24px', borderBottom:'1px solid #1b2740', position:'sticky', top:0, background:'#0b1220', zIndex:10}}>
      <Link to="/" style={{fontWeight:700,fontSize:18}}>⚡ MiniAuction</Link>
      <div style={{flex:1}} />
      <Link to="/create">Create</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/admin">Admin</Link>
      {!me ? (
        <>
          <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)}/>
          <input type="password" placeholder="password" value={pw} onChange={e=>setPw(e.target.value)}/>
          <button onClick={()=>onLogin(email,pw)}>Login</button>
          <button onClick={()=>onRegister(email,pw)}>Register</button>
        </>
      ) : (
        <>
          <span className="badge">{me.email}</span>
          <button onClick={onLogout}>Logout</button>
        </>
      )}
    </div>
  );
}
