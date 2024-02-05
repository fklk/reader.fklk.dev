import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { lucia } from "@/lib/auth";
import { z } from "zod";

export const sessionRouter = createTRPCRouter({
    validate: publicProcedure
        .input(z.object({ sessionId: z.string() }))
        .query(async ({ input }) => {
            const { session } = await lucia.validateSession(input.sessionId);
            return session;
        }),
});
