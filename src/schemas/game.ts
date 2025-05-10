import { z } from "zod";

export const endGameSchema = z.object({
  gameId: z.string(),
});
