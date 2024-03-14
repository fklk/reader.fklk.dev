// Source: https://github.com/t3-oss/create-t3-app
// General layout adopted, customized to requirements

import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { sessionRouter } from "./routers/session";
import { novelRouter } from "./routers/novel";
import { genreRouter } from "./routers/genre";
import { userRouter } from "./routers/user";
import { chapterRouter } from "./routers/chapter";
import { commentRouter } from "./routers/comment";
import { insightRouter } from "./routers/insight";

export const appRouter = createTRPCRouter({
    session: sessionRouter,
    novel: novelRouter,
    genre: genreRouter,
    user: userRouter,
    chapter: chapterRouter,
    comment: commentRouter,
    insight: insightRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
