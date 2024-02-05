import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "../../lib/db";
import { validateRequest } from "@/lib/auth";

export const createTRPCContext = async (opts: { headers?: Headers }) => {
    return {
        db,
        ...opts,
    };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    },
});

const isAuthenticated = t.middleware(async opts => {
    const { session } = await validateRequest();

    if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next();
});

const isAdmin = t.middleware(async opts => {
    const { session, user } = await validateRequest();

    if (!session || user.role !== "ADMIN") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next();
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthenticated);
// TODO: Used for admin panel (make panel only availabel for admin users)
// - add genres
// - delete comments
// - ...
export const adminProcedure = t.procedure.use(isAdmin);
