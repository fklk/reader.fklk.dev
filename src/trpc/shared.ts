// Source: https://github.com/t3-oss/create-t3-app

import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "@/server/api/root";

export const transformer = superjson;

export function getBaseUrl() {
    if (process.env.NODE_ENV === "production") return "https://readr.fklk.dev";
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function getUrl() {
    return getBaseUrl() + "/api/trpc";
}

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
