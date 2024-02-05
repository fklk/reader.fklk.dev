import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const chapterRouter = createTRPCRouter({
    getAll: privateProcedure.query(async ({ ctx }) => {
        return await ctx.db.chapter.findMany();
    }),
});
