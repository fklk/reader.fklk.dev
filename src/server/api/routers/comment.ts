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

    getForNovel: privateProcedure
        .input(z.object({ novelId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.comment.findMany({
                where: {
                    AND: [
                        {
                            novelId: input.novelId,
                        },
                        {
                            chapter: null,
                        },
                    ],
                },
                orderBy: {
                    createdAt: "desc",
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

    createOnNovel: privateProcedure
        .input(
            z.object({
                novelId: z.string(),
                content: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.comment.create({
                data: {
                    novel: {
                        connect: {
                            id: input.novelId,
                        },
                    },
                    author: {
                        connect: {
                            id: ctx.user!.id,
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
                    novelId: true,
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
                    novel: {
                        connect: {
                            id: chapter.novelId,
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
