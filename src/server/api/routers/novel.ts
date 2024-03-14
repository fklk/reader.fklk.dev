import {
    adminProcedure,
    createTRPCRouter,
    privateProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { NovelStatus } from "@prisma/client";

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
                    imgPath: "",
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

    update: privateProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                description: z.string().optional(),
                status: z.string().optional(),
                genre: z.string().optional(),
                imgPath: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const novel = await ctx.db.novel.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    genre: true,
                },
            });

            if (!novel) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }

            if (input.genre && input.genre !== novel.genre.name) {
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
                    genre =>
                        genre.name.toLowerCase() === input.genre!.toLowerCase()
                );

                await ctx.db.novel.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        genreId: genre!.id,
                    },
                });
            }

            if (input.status && input.status !== novel.status) {
                await ctx.db.novel.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        status: input.status.toUpperCase() as NovelStatus,
                    },
                });
            }

            if (input.name && input.name !== novel.name) {
                await ctx.db.novel.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        name: input.name,
                    },
                });
            }

            if (input.description && input.description !== novel.description) {
                await ctx.db.novel.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        description: input.description,
                    },
                });
            }

            if (input.imgPath && input.imgPath !== novel.imgPath) {
                await ctx.db.novel.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        imgPath: input.imgPath,
                    },
                });
            }
        }),

    setImgPath: privateProcedure
        .input(z.object({ id: z.string(), imgPath: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const novel = await ctx.db.novel.findUnique({
                where: {
                    id: input.id,
                },
            });

            if (!novel) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            if (novel.authorId !== ctx.user?.id) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            return await ctx.db.novel.update({
                where: {
                    id: input.id,
                },
                data: {
                    imgPath: input.imgPath,
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

    getAll: privateProcedure
        .input(
            z.object({
                include: z.array(includableFields).optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.db.novel.findMany({
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

    purgeShowcases: adminProcedure.mutation(async ({ ctx }) => {
        return await ctx.db.novel.updateMany({
            where: {
                isOnShowcase: true,
            },
            data: {
                isOnShowcase: false,
            },
        });
    }),

    setShowcaseNovels: adminProcedure
        .input(z.object({ ids: z.array(z.string()) }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.novel.updateMany({
                where: {
                    id: {
                        in: input.ids,
                    },
                },
                data: {
                    isOnShowcase: true,
                },
            });
        }),

    getShowcaseNovels: privateProcedure.query(async ({ ctx }) => {
        return await ctx.db.novel.findMany({
            where: {
                isOnShowcase: true,
            },
        });
    }),

    delete: adminProcedure
        .input(z.object({ ids: z.array(z.string()) }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.novel.deleteMany({
                where: {
                    id: {
                        in: input.ids,
                    },
                },
            });
        }),

    updateBulk: adminProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string(),
                description: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.novel.update({
                data: {
                    name: input.name,
                    description: input.description,
                },
                where: {
                    id: input.id,
                },
            });
        }),
});
