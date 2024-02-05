import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
    getAll: privateProcedure.query(async ({ ctx }) => {
        return await ctx.db.user.findMany();
    }),
});
