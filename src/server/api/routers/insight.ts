import { db } from "@/lib/db";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { z } from "zod";

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
});
