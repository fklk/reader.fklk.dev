import {
    adminProcedure,
    createTRPCRouter,
    privateProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { createCaller } from "../root";
import { TRPCError } from "@trpc/server";

export const genreRouter = createTRPCRouter({
    create: adminProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const routerCaller = createCaller(ctx);
            const allGenres = (await routerCaller.genre.getAll()).map(genre =>
                genre.name.toLowerCase()
            );

            if (allGenres.includes(input.name.toLowerCase())) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "A genre with that name already exists.",
                });
            }

            return await ctx.db.genre.create({
                data: {
                    name: input.name,
                },
            });
        }),

    getAll: privateProcedure.query(async ({ ctx }) => {
        return await ctx.db.genre.findMany();
    }),
});
