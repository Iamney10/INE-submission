import React from 'react';
import { Link } from 'react-router-dom';

export default function AuctionCard({ a }){
  return (
    <div className="card">
      <div className="row">
        <div style={{fontWeight:700,fontSize:18}}>{a.itemName}</div>
        <span className="badge">{a.status}</span>
      </div>
      <div style={{opacity:.8, margin:'6px 0'}}>{a.description}</div>
      <div className="row">
        <div>Start ₹{a.startingPrice}</div>
        <div>Step +₹{a.bidIncrement}</div>
        <div>Live: {new Date(a.goLiveAt).toLocaleString()}</div>
        <div>Dur: {a.durationSec}s</div>
      </div>
      <div style={{marginTop:8}}>
        <Link to={`/auction/${a.id}`}><button>Open Room</button></Link>
      </div>
    </div>
  );
}
