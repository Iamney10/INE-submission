export const now = () => new Date();
export const endsAt = (auction) => new Date(new Date(auction.goLiveAt).getTime() + auction.durationSec * 1000);
export const isLive = (auction) => {
  const t = now();
  return t >= new Date(auction.goLiveAt) && t < endsAt(auction) && auction.status !== 'closed';
};
