import React, { useEffect, useState } from 'react';
import api from '../api.js';
import AuctionCard from '../components/AuctionCard.jsx';

export default function Home(){
  const [list, setList] = useState([]);
  useEffect(()=>{
    api.get('/auctions').then(({data}) => setList(data));
  },[]);
  return (
    <>
      <h2>Live & Upcoming Auctions</h2>
      <div className="grid">
        {list.map(a => <AuctionCard key={a.id} a={a}/>)}
      </div>
    </>
  );
}
