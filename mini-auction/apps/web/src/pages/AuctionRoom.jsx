import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import api from '../api.js';
import { makeSocket } from '../socket.js';
import Countdown from '../components/Countdown.jsx';
import Toast from '../components/Toast.jsx';

export default function AuctionRoom(){
  const { id } = useParams();
  const { me } = useOutletContext();
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState('');
  const [toast, setToast] = useState('');

  const socket = useMemo(()=> makeSocket(me?.id || null), [me]);

  useEffect(()=>{
    api.get(`/auctions/${id}`).then(({data}) => setData(data));
  },[id]);

  useEffect(()=>{
    if (!socket || !id) return;
    socket.emit('join-auction', +id);
    socket.on('new-bid', (p) => {
      if (p.auctionId == id) setData(d => ({...d, highest: { amount: p.amount, bidderId: p.bidderId }}));
    });
    socket.on('outbid', (p) => {
      if (p.auctionId == id) setToast('You have been outbid!');
    });
    socket.on('auction-ended', (p) => {
      if (p.auctionId == id) setToast('Auction ended. Seller will decide soon.');
    });
    socket.on('seller-decision', ({ decision }) => setToast(`Seller: ${decision}`));
    socket.on('counter-offer', ({ price }) => setToast(`Seller countered at ₹${price}`));
    socket.on('transaction-confirmed', ()=> setToast('Transaction confirmed. Check email for invoice.'));
    return ()=> socket.emit('leave-auction', +id);
  }, [socket, id]);

  if (!data) return <div>Loading...</div>;
  const a = data.auction;
  const highest = data.highest || { amount: a.startingPrice, bidderId: null };

  const placeBid = async () => {
    if (!me) return alert('Login first');
    const { data:res } = await api.post('/bids', { auctionId: a.id, amount: +amount });
    setAmount('');
  };

  const accept = async () => {
    await api.post(`/auctions/${a.id}/accept`);
    await api.post(`/auctions/${a.id}/finalize`);
  };
  const reject = async () => { await api.post(`/auctions/${a.id}/reject`); };
  const counter = async () => {
    const price = +prompt('Counter price?');
    if (!price) return;
    await api.post(`/auctions/${a.id}/counter`, { price, buyerId: highest.bidderId });
  };

  const buyerAcceptCounter = async () => {
    await api.post(`/bids/counter/${a.id}/accept`);
    await api.post(`/auctions/${a.id}/finalize`);
  };
  const buyerRejectCounter = async () => {
    await api.post(`/bids/counter/${a.id}/reject`);
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>{a.itemName} <span className="badge">{a.status}</span></h2>
        <div>{a.description}</div>
        <div className="row" style={{marginTop:6}}>
          <div>Start ₹{a.startingPrice}</div>
          <div>Step +₹{a.bidIncrement}</div>
          <div>Go live: {new Date(a.goLiveAt).toLocaleString()}</div>
          <div>Ends: {new Date(data.endsAt).toLocaleTimeString()}</div>
          <Countdown endsAt={data.endsAt}/>
        </div>
      </div>

      <div className="card">
        <h3>Highest Bid: ₹{highest.amount}</h3>
        <div className="row">
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Your bid (₹)" type="number"/>
          <button onClick={placeBid}>Place Bid</button>
        </div>
      </div>

      {/* Seller controls */}
      {me?.id === a.sellerId && a.status !== 'closed' && (
        <div className="card">
          <h3>Seller Actions</h3>
          <div className="row">
            <button onClick={accept}>Accept</button>
            <button onClick={reject}>Reject</button>
            <button onClick={counter}>Counter-Offer</button>
          </div>
        </div>
      )}

      {/* Buyer counter-offer controls */}
      {me?.id === highest.bidderId && a.sellerDecision === 'countered' && (
        <div className="card">
          <h3>Seller made a counter-offer</h3>
          <div className="row">
            <button onClick={buyerAcceptCounter}>Accept Counter</button>
            <button onClick={buyerRejectCounter}>Reject Counter</button>
          </div>
        </div>
      )}

      <Toast msg={toast}/>
    </div>
  );
}
