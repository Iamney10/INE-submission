import React, { useState } from 'react';
import api from '../api.js';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function CreateAuction(){
  const { me } = useOutletContext();
  const nav = useNavigate();
  const [form, setForm] = useState({
    itemName:'', description:'', startingPrice:100, bidIncrement:10,
    goLiveAt: new Date(Date.now()+10_000).toISOString(),
    durationSec: 60
  });

  const set = (k,v)=> setForm(f=>({...f,[k]:v}));

  const create = async () => {
    if (!me) return alert('Login required');
    const { data } = await api.post('/auctions', {
      ...form,
      startingPrice: +form.startingPrice,
      bidIncrement: +form.bidIncrement,
      durationSec: +form.durationSec
    });
    nav(`/auction/${data.id}`);
  };

  return (
    <div className="card">
      <h3>Create Auction</h3>
      <div className="grid grid-3">
        <input placeholder="Item name" value={form.itemName} onChange={e=>set('itemName',e.target.value)} />
        <input placeholder="Starting price" type="number" value={form.startingPrice} onChange={e=>set('startingPrice',e.target.value)} />
        <input placeholder="Bid increment" type="number" value={form.bidIncrement} onChange={e=>set('bidIncrement',e.target.value)} />
        <input placeholder="Go live at (ISO)" value={form.goLiveAt} onChange={e=>set('goLiveAt',e.target.value)} />
        <input placeholder="Duration (sec)" type="number" value={form.durationSec} onChange={e=>set('durationSec',e.target.value)} />
      </div>
      <textarea placeholder="Description" value={form.description} onChange={e=>set('description',e.target.value)} rows={4}/>
      <div style={{marginTop:8}}><button onClick={create}>Create</button></div>
    </div>
  );
}
