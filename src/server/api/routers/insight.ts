import { db } from "@/lib/db";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createCaller } from "../root";
import { Novel } from "@prisma/client";

export const insightRouter = createTRPCRouter({
    getCustomById: privateProcedure
        .input(z.object({ novelId: z.string(), trigger: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.customNovelInsight.findUnique({
                where: {
                    novelId_userId_trigger: {
                        novelId: input.novelId,
                        trigger: input.trigger,
                        userId: ctx.user!.id,
                    },
                },
            });
        }),

    createCustom: privateProcedure
        .input(
            z.object({
                novelId: z.string(),
                trigger: z.string(),
                content: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.customNovelInsight.create({
                data: {
                    trigger: input.trigger,
                    content: input.content,
                    novelId: input.novelId,
                    userId: ctx.user!.id,
                },
            });
        }),

    createGlobal: privateProcedure
        .input(
            z.object({
                novelId: z.string(),
                trigger: z.string(),
                content: z.string(),
                chapterId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const caller: any = createCaller(ctx);

            const novel = await caller.novel.getById({
                id: input.novelId,
            });

            if (novel?.authorId !== ctx.user!.id) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            return await ctx.db.novelInsight.create({
                data: {
                    trigger: input.trigger,
                    content: input.content,
                    novelId: input.novelId,
                    chapterId: input.chapterId,
                },
            });
        }),

    deleteCustom: privateProcedure
        .input(
            z.object({
                novelId: z.string(),
                trigger: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.customNovelInsight.delete({
                where: {
                    novelId_userId_trigger: {
                        trigger: input.trigger,
                        novelId: input.novelId,
                        userId: ctx.user!.id,
                    },
                },
            });
        }),

    updateCustom: privateProcedure
        .input(
            z.object({
                novelId: z.string(),
                originalTrigger: z.string(),
                newTrigger: z.string(),
                content: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.customNovelInsight.update({
                where: {
                    novelId_userId_trigger: {
                        novelId: input.novelId,
                        trigger: input.originalTrigger,
                        userId: ctx.user!.id,
                    },
                },
                data: {
                    trigger: input.newTrigger,
                    content: input.content,
                },
            });
        }),

    getAllForId: privateProcedure
        .input(z.object({ novelId: z.string(), chapterId: z.string() }))
        .query(async ({ ctx, input }) => {
            let insights: {
                trigger: string;
                content: string;
            }[] = [];

            const insightStates = await ctx.db.userNovelInsightState.findMany({
                where: {
                    userId: ctx.user?.id,
                    novelId: input.novelId,
                },
            });

            if (
                insightStates.find(
                    state => state.category === "DEFAULT" && state.isActive
                )
            ) {
                const caller = createCaller(ctx);
                const userReadingProgress =
                    await caller.user.getReadingProgress({
                        include: ["chapter"],
                    });

                const chapterReadingProgress = userReadingProgress
                    .filter(rp => rp.novelId === input.novelId)
                    .sort(
                        (a, b) => b.chapter.descriptor - a.chapter.descriptor
                    );

                const defaultInsights = await ctx.db.novelInsight.findMany({
                    where: {
                        novelId: input.novelId,
                    },
                    include: {
                        chapter: true,
                    },
                });

                defaultInsights.forEach(insight => {
                    if (
                        insight.chapter.descriptor <=
                        chapterReadingProgress.at(0)!.chapter.descriptor
                    ) {
                        insights.push({
                            trigger: insight.trigger,
                            content: insight.content,
                        });
                    }
                });
            }

            if (
                insightStates.find(
                    state => state.category === "CUSTOM" && state.isActive
                )
            ) {
                const customInsights = await ctx.db.customNovelInsight.findMany(
                    {
                        where: {
                            novelId: input.novelId,
                            userId: ctx.user!.id,
                        },
                    }
                );
                customInsights.forEach(insight => {
                    insights.push({
                        trigger: insight.trigger,
                        content: insight.content,
                    });
                });
            }

            return insights;
        }),

    enable: privateProcedure
        .input(z.object({ novelId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.userNovelInsightState.createMany({
                data: [
                    {
                        novelId: input.novelId,
                        userId: ctx.user!.id,
                        category: "DEFAULT",
                        isActive: true,
                    },
                    {
                        novelId: input.novelId,
                        userId: ctx.user!.id,
                        category: "CUSTOM",
                        isActive: true,
                    },
                ],
            });
        }),
});
