import { z } from 'zod';

export const auctionSchema = z.object({
  itemName: z.string().min(1),
  description: z.string().optional(),
  startingPrice: z.number().int().positive(),
  bidIncrement: z.number().int().positive(),
  goLiveAt: z.string().transform(v => new Date(v)),
  durationSec: z.number().int().positive()
});

export const bidSchema = z.object({
  auctionId: z.number().int().positive(),
  amount: z.number().int().positive()
});
