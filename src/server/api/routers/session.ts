import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getUser, lucia, validateRequest } from "@/lib/auth";
import { z } from "zod";

export const sessionRouter = createTRPCRouter({
    validate: publicProcedure
        .input(z.object({ sessionId: z.string() }))
        .query(async ({ input }) => {
            const { session } = await lucia.validateSession(input.sessionId);
            return session;
        }),

    getUser: publicProcedure.query(async () => {
        return await getUser();
    }),
});
