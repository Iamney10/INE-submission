import React from 'react';
export default function Toast({ msg }){
  if (!msg) return null;
  return (
    <div style={{position:'fixed', right:16, bottom:16, background:'#17223a', border:'1px solid #2e3d63', padding:12, borderRadius:12}}>
      {msg}
    </div>
  );
}
