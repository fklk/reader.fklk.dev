import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { createCaller } from "../root";
import { TRPCError } from "@trpc/server";

export const storyRouter = createTRPCRouter({
    create: privateProcedure
        .input(
            z.object({
                name: z.string(),
                description: z.string().optional(),
                genre: z.string(),
                authorId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const routerCaller = createCaller(ctx);
            const availableGenres = await routerCaller.genre.getAll();

            if (
                !availableGenres
                    .map(genre => genre.name.toLowerCase())
                    .includes(input.genre.toLowerCase())
            ) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid genre name.",
                });
            }

            const userIds = (await routerCaller.user.getAll()).map(
                user => user.id
            );

            if (!userIds.includes(input.authorId)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid user id.",
                });
            }

            const genre = availableGenres.find(
                genre => genre.name.toLowerCase() === input.name.toLowerCase()
            );

            await ctx.db.story.create({
                data: {
                    name: input.name,
                    description: input.description,
                    genre: {
                        connect: {
                            id: genre!.id,
                        },
                    },
                    author: {
                        connect: {
                            id: input.authorId,
                        },
                    },
                },
            });
        }),

    getAll: privateProcedure.query(async ({ ctx }) => {
        return await ctx.db.story.findMany();
    }),
});
