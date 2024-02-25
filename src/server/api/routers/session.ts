import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { lucia } from "@/lib/auth";
import { z } from "zod";

export const sessionRouter = createTRPCRouter({
    validate: publicProcedure
        .input(z.object({ sessionId: z.string() }))
        .query(async ({ input }) => {
            return await lucia.validateSession(input.sessionId);
        }),

    getUser: publicProcedure.query(({ ctx }) => {
        return ctx.user;
    }),
});
