import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { api } from "@/trpc/client";
import { z } from "zod";

const includableFields = z.enum([
    "novel",
    "comments",
    "readingProgress",
    "novelInsight",
]);

export const chapterRouter = createTRPCRouter({
    getAll: privateProcedure
        .input(
            z
                .object({
                    novelId: z.string().optional(),
                    limit: z.number().optional(),
                })
                .optional()
        )
        .query(async ({ ctx, input }) => {
            const whereCondition = input?.novelId
                ? { novelId: input.novelId }
                : undefined;
            const takeCondition = input?.limit
                ? { take: input.limit }
                : undefined;

            return await ctx.db.chapter.findMany({
                where: whereCondition,
                ...takeCondition,
                orderBy: {
                    descriptor: "desc",
                },
            });
        }),

    getById: privateProcedure
        .input(
            z.object({
                id: z.string(),
                include: z.array(includableFields).optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.db.chapter.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    novel: input.include?.includes("novel") ?? false,
                    comments: input.include?.includes("comments") ?? false,
                    readingProgress:
                        input.include?.includes("readingProgress") ?? false,
                    novelInsight:
                        input.include?.includes("novelInsight") ?? false,
                },
            });
        }),

    getLatestForNovel: privateProcedure
        .input(
            z.object({
                novelId: z.string(),
                include: z.array(includableFields).optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.db.chapter.findMany({
                take: 1,
                where: {
                    novelId: input.novelId,
                },
                include: {
                    novel: input.include?.includes("novel") ?? false,
                    comments: input.include?.includes("comments") ?? false,
                    readingProgress:
                        input.include?.includes("readingProgress") ?? false,
                    novelInsight:
                        input.include?.includes("novelInsight") ?? false,
                },
                orderBy: {
                    descriptor: "desc",
                },
            });
        }),

    getLatestForNovels: privateProcedure
        .input(
            z.object({
                novelIds: z.string().array(),
                include: z.array(includableFields).optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.db.chapter.findMany({
                take: input.novelIds.length,
                distinct: "novelId",
                where: {
                    novelId: { in: input.novelIds },
                },
                include: {
                    novel: input.include?.includes("novel") ?? false,
                    comments: input.include?.includes("comments") ?? false,
                    readingProgress:
                        input.include?.includes("readingProgress") ?? false,
                    novelInsight:
                        input.include?.includes("novelInsight") ?? false,
                },
                orderBy: {
                    descriptor: "desc",
                },
            });
        }),

    getAllForNovels: privateProcedure
        .input(z.object({ novelIds: z.string().array() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.chapter.findMany({
                where: {
                    novelId: { in: input.novelIds },
                },
            });
        }),

    getMinMax: privateProcedure.query(async ({ ctx }) => {
        const minMax = await ctx.db.chapter.aggregate({
            _min: {
                descriptor: true,
            },
            _max: {
                descriptor: true,
            },
        });

        return {
            minChapters: minMax._min.descriptor ?? 0,
            maxChapters: minMax._max.descriptor ?? 0,
        };
    }),
});
