import React, { useEffect, useState } from 'react';
import api from '../api.js';
import AuctionCard from '../components/AuctionCard.jsx';

export default function Dashboard(){
  const [list, setList] = useState([]);
  useEffect(()=>{ api.get('/auctions').then(({data})=> setList(data)); }, []);
  return (
    <>
      <h2>Your Auctions</h2>
      {list.filter(a=>true).map(a => <AuctionCard key={a.id} a={a} />)}
    </>
  );
}
