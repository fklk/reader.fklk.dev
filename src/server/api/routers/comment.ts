import {
    adminProcedure,
    createTRPCRouter,
    privateProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const commentRouter = createTRPCRouter({
    delete: privateProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.comment.delete({
                where: {
                    id: input.id,
                },
            });
        }),

    getForStory: privateProcedure
        .input(z.object({ storyId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.comment.findMany({
                where: {
                    AND: [
                        {
                            storyId: input.storyId,
                        },
                        {
                            chapter: null,
                        },
                    ],
                },
            });
        }),

    getForChapter: privateProcedure
        .input(z.object({ chapterId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.comment.findMany({
                where: {
                    chapterId: input.chapterId,
                },
            });
        }),

    createOnStory: privateProcedure
        .input(
            z.object({
                storyId: z.string(),
                authorId: z.string(),
                content: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.comment.create({
                data: {
                    story: {
                        connect: {
                            id: input.storyId,
                        },
                    },
                    author: {
                        connect: {
                            id: input.authorId,
                        },
                    },
                    content: input.content,
                },
            });
        }),

    createOnChapter: privateProcedure
        .input(
            z.object({
                chapterId: z.string(),
                authorId: z.string(),
                content: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const chapter = await ctx.db.chapter.findUnique({
                where: {
                    id: input.chapterId,
                },
                select: {
                    storyId: true,
                },
            });

            if (!chapter) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid chapter id.",
                });
            }

            return await ctx.db.comment.create({
                data: {
                    story: {
                        connect: {
                            id: chapter.storyId,
                        },
                    },
                    chapter: {
                        connect: {
                            id: input.chapterId,
                        },
                    },
                    author: {
                        connect: {
                            id: input.authorId,
                        },
                    },
                    content: input.content,
                },
            });
        }),
});
