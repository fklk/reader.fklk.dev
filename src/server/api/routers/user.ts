import {
    adminProcedure,
    createTRPCRouter,
    privateProcedure,
} from "@/server/api/trpc";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const includableFields = z.enum(["user", "novel", "chapter"]);

export const userRouter = createTRPCRouter({
    getAll: privateProcedure.query(async ({ ctx }) => {
        return await ctx.db.user.findMany();
    }),

    getReadingProgress: privateProcedure
        .input(
            z.object({
                include: z.array(includableFields).optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.db.readingProgress.findMany({
                where: {
                    userId: ctx.user!.id,
                },
                include: {
                    user: input.include?.includes("user") ?? false,
                    novel: input.include?.includes("novel") ?? false,
                    chapter: input.include?.includes("chapter") ?? false,
                },
            });
        }),

    addNovelToList: privateProcedure
        .input(
            z.object({
                novelId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.userList.create({
                data: {
                    novelId: input.novelId,
                    userId: ctx.user!.id,
                },
            });
        }),

    removeNovelFromList: privateProcedure
        .input(
            z.object({
                novelId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.userList.delete({
                where: {
                    userId_novelId: {
                        novelId: input.novelId,
                        userId: ctx.user!.id,
                    },
                },
            });
        }),

    isNovelOnList: privateProcedure
        .input(z.object({ novelId: z.string() }))
        .query(async ({ ctx, input }) => {
            return !!(await ctx.db.userList.findUnique({
                where: {
                    userId_novelId: {
                        userId: ctx.user!.id,
                        novelId: input.novelId,
                    },
                },
            }));
        }),

    getAllAuthors: privateProcedure.query(async ({ ctx }) => {
        return await ctx.db.user.findMany({
            where: {
                authorOf: {
                    some: {},
                },
            },
        });
    }),

    getListNovelIds: privateProcedure.query(async ({ ctx }) => {
        return (
            await ctx.db.userList.findMany({
                select: {
                    novelId: true,
                },
                where: {
                    userId: ctx.user?.id,
                },
            })
        ).map(ul => ul.novelId);
    }),

    getInsightNovels: privateProcedure.query(async ({ ctx }) => {
        return await ctx.db.userNovelInsightState.findMany({
            distinct: ["novelId"],
            where: {
                userId: ctx.user?.id,
            },
            include: {
                novel: true,
            },
        });
    }),

    delete: adminProcedure
        .input(z.object({ ids: z.array(z.string()) }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.user.deleteMany({
                where: {
                    id: {
                        in: input.ids,
                    },
                },
            });
        }),

    update: adminProcedure
        .input(
            z.object({
                id: z.string(),
                handle: z.string(),
                email: z.string(),
                role: z.enum([UserRole.ADMIN, UserRole.USER]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.db.user.update({
                data: {
                    handle: input.handle,
                    email: input.email,
                    role: input.role,
                },
                where: {
                    id: input.id,
                },
            });
        }),

    updateSelf: privateProcedure
        .input(
            z.object({
                handle: z.string(),
                email: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.db.user.update({
                data: {
                    handle: input.handle,
                    email: input.email,
                },
                where: {
                    id: ctx.user?.id,
                },
            });
        }),
});
