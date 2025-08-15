import React, { useEffect, useState } from 'react';
import api from '../api.js';

export default function Admin(){
  const [list, setList] = useState([]);
  const load = async () => { try {
    const { data } = await api.get('/admin/auctions'); setList(data);
  } catch { alert('Admin only'); } };
  useEffect(()=>{ load(); }, []);

  const start = async (id) => { await api.post(`/admin/auctions/${id}/start`); load(); };
  const reset = async (id) => { await api.post(`/admin/auctions/${id}/reset`); load(); };

  return (
    <div>
      <h2>Admin Panel</h2>
      {list.map(a=>(
        <div key={a.id} className="card">
          <div style={{fontWeight:600}}>{a.itemName} <span className="badge">{a.status}</span></div>
          <div className="row">
            <button onClick={()=>start(a.id)}>Force Start</button>
            <button onClick={()=>reset(a.id)}>Reset</button>
          </div>
        </div>
      ))}
    </div>
  );
}
