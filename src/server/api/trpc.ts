// Source: https://github.com/t3-oss/create-t3-app
// Small modifications made

import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "../../lib/db";
import { getUser, validateRequest } from "@/lib/auth";

// Modifications were made
export const createTRPCContext = async (opts: { headers?: Headers }) => {
    const user = await getUser();

    return {
        db,
        user,
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

// Added
const isAuthenticated = t.middleware(async opts => {
    const { session } = await validateRequest();

    if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next();
});

// Added
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
export const adminProcedure = t.procedure.use(isAdmin);
