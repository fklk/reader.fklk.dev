import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { sessionRouter } from "./routers/session";
import { storyRouter } from "./routers/story";
import { genreRouter } from "./routers/genre";
import { userRouter } from "./routers/user";
import { chapterRouter } from "./routers/chapter";
import { commentRouter } from "./routers/comment";

export const appRouter = createTRPCRouter({
    session: sessionRouter,
    story: storyRouter,
    genre: genreRouter,
    user: userRouter,
    chapter: chapterRouter,
    comment: commentRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
