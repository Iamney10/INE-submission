import React, { useEffect, useState } from 'react';

export default function Countdown({ endsAt }){
  const [left, setLeft] = useState(()=> Math.max(0, new Date(endsAt) - Date.now()));
  useEffect(()=>{
    const t = setInterval(()=> setLeft(Math.max(0, new Date(endsAt) - Date.now())), 250);
    return ()=> clearInterval(t);
  }, [endsAt]);
  const s = Math.ceil(left/1000);
  return <span className="badge">⏳ {s}s left</span>;
}
