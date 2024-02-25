import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const includableFields = z.enum([
    "comments",
    "readingProgress",
    "novelInsights",
    "author",
    "userLists",
    "chapters",
    "genre",
    "customInsights",
]);

export const novelRouter = createTRPCRouter({
    create: privateProcedure
        .input(
            z.object({
                name: z.string(),
                description: z.string(),
                genre: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const availableGenres = await ctx.db.genre.findMany();

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

            const genre = availableGenres.find(
                genre => genre.name.toLowerCase() === input.genre.toLowerCase()
            );

            return await ctx.db.novel.create({
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
                            id: ctx.user!.id,
                        },
                    },
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
            return await ctx.db.novel.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    comments: input.include?.includes("comments") ?? false,
                    readingProgress:
                        input.include?.includes("readingProgress") ?? false,
                    novelInsights:
                        input.include?.includes("novelInsights") ?? false,
                    author: input.include?.includes("author") ?? false,
                    userLists: input.include?.includes("userLists") ?? false,
                    chapters: input.include?.includes("chapters") ?? false,
                    genre: input.include?.includes("genre") ?? false,
                    customInsights:
                        input.include?.includes("customInsights") ?? false,
                },
            });
        }),

    getAll: privateProcedure.query(async ({ ctx }) => {
        return await ctx.db.novel.findMany();
    }),

    getMatches: privateProcedure
        .input(z.object({ query: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.novel.findMany({
                where: {
                    name: {
                        contains: input.query,
                        mode: "insensitive",
                    },
                },
            });
        }),

    getAllByPopularity: privateProcedure
        .input(
            z.object({
                genre: z.string().optional(),
                author: z.string().optional(),
                minChapter: z.number().optional(),
                limit: z.number().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const novelsByPopularity = await ctx.db.novel.groupBy({
                by: ["id", "views"],
                orderBy: {
                    views: "desc",
                },
                where: {
                    genre: {
                        name: {
                            equals: input.genre,
                            mode: "insensitive",
                        },
                    },

                    author: {
                        handle: {
                            equals: input.author,
                            mode: "insensitive",
                        },
                    },
                },

                take: input.limit,
            });

            let novelIdsByPopularity = novelsByPopularity.map(
                novel => novel.id
            );

            if (input.minChapter) {
                const groupedChapters = await ctx.db.chapter.groupBy({
                    by: ["novelId"],
                    where: {
                        novelId: {
                            in: novelIdsByPopularity,
                        },
                    },
                    having: {
                        novelId: {
                            _count: {
                                gte: input.minChapter,
                            },
                        },
                    },
                });

                novelIdsByPopularity = novelIdsByPopularity.filter(id =>
                    groupedChapters.map(chapter => chapter.novelId).includes(id)
                );
            }

            return novelIdsByPopularity;
        }),

    incrementView: privateProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.novel.update({
                where: {
                    id: input.id,
                },
                data: {
                    views: {
                        increment: 1,
                    },
                },
            });
        }),

    getInsights: privateProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.novelInsight.findMany({
                where: {
                    novelId: input.id,
                },
            });
        }),

    getCustomInsights: privateProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.customNovelInsight.findMany({
                where: {
                    novelId: input.id,
                    userId: ctx.user?.id,
                },
            });
        }),

    getInsightState: privateProcedure
        .input(
            z.object({
                novelId: z.string(),
                category: z.enum(["DEFAULT", "CUSTOM"]),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.db.userNovelInsightState.findUnique({
                where: {
                    userId_novelId_category: {
                        novelId: input.novelId,
                        userId: ctx.user!.id,
                        category: input.category,
                    },
                },
            });
        }),

    setInsightState: privateProcedure
        .input(
            z.object({
                novelId: z.string(),
                category: z.enum(["DEFAULT", "CUSTOM"]),
                state: z.enum(["active", "inactive"]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.userNovelInsightState.upsert({
                where: {
                    userId_novelId_category: {
                        novelId: input.novelId,
                        userId: ctx.user!.id,
                        category: input.category,
                    },
                },
                create: {
                    novelId: input.novelId,
                    userId: ctx.user!.id,
                    category:
                        input.category.toLowerCase() === "default"
                            ? "DEFAULT"
                            : "CUSTOM",
                    isActive: input.state === "active",
                },
                update: {
                    isActive: input.state === "active",
                },
            });
        }),

    getWrittenByCurrentUser: privateProcedure.query(async ({ ctx }) => {
        return await ctx.db.novel.findMany({
            where: {
                authorId: ctx.user?.id,
            },
        });
    }),
});
