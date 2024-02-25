"use server";

import { ActionResult } from "@/app/_components/form";
import { api } from "@/trpc/server";
import { revalidateTag } from "next/cache";
import { lucia, validateRequest } from "./auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";

export const createCommentOnNovel = async (
    novelId: string,
    formData: FormData
) => {
    const content = formData.get("content") as string;

    await api.comment.createOnNovel.mutate({
        content: content,
        novelId: novelId,
    });
};

export const updateCustomInsight = async (
    novelId: string,
    originalTrigger: string,
    formData: FormData
) => {
    const trigger = formData.get("trigger") as string;

    if (!trigger) {
        return;
    }

    const content = formData.get("content") as string;

    if (!content) {
        return;
    }

    const insight = await api.insight.getCustomById.query({
        novelId: novelId,
        trigger: originalTrigger,
    });

    if (!insight) {
        return;
    }

    await api.insight.updateCustom.mutate({
        novelId: novelId,
        originalTrigger: originalTrigger,
        newTrigger: trigger,
        content: content,
    });

    revalidateTag("/");
};

export const deleteCustomInsight = async (
    novelId: string,
    trigger: string,
    _formData: FormData
) => {
    await api.insight.deleteCustom.mutate({
        novelId: novelId,
        trigger: trigger,
    });

    revalidateTag("/");
};

export const addNovelInsight = async (novelId: string, formData: FormData) => {
    const trigger = formData.get("trigger") as string;

    if (!trigger) {
        return;
    }

    const content = formData.get("content") as string;

    if (!content) {
        return;
    }

    const insight = await api.insight.getCustomById.query({
        novelId: novelId,
        trigger: trigger,
    });

    if (insight) {
        return;
    }

    await api.insight.createCustom.mutate({
        novelId: novelId,
        trigger: trigger,
        content: content,
    });

    revalidateTag("/");
};

export const handleSignOut = async () => {
    const { session } = await validateRequest();
    if (!session) {
        return;
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
    return redirect("/signin");
};

export const handleSignUp = async (
    _: any,
    formData: FormData
): Promise<ActionResult> => {
    // TODO: Create api routes

    const email = formData.get("email") as string;
    // TODO: Verify email conditions with zod (?)
    if (email.length < 4) {
        return {
            error: "Invalid email",
        };
    }

    const handle = formData.get("handle") as string;
    // TODO: Verify handle conditions with zod (?)
    if (handle.length < 4) {
        return {
            error: "Invalid handle",
        };
    }

    const password = formData.get("password") as string;
    // TODO: Verify password conditions with zod (?)
    if (password.length < 5) {
        return {
            error: "Invalid password",
        };
    }

    const repeatedPassword = formData.get("repeatedPassword") as string;

    if (password !== repeatedPassword) {
        return {
            error: "Passwords do not match",
        };
    }

    const isEmailTaken = await db.user.findUnique({
        where: {
            email: email,
        },
    });

    if (isEmailTaken) {
        return {
            error: "Email is already in use",
        };
    }

    const isHandleTaken = await db.user.findUnique({
        where: {
            handle: handle,
        },
    });

    if (isHandleTaken) {
        return {
            error: "Handle is already in use",
        };
    }

    const hashedPassword = await new Argon2id().hash(password);
    const userId = generateId(32);

    await db.user.create({
        data: {
            id: userId,
            email: email,
            handle: handle,
            hashedPassword: hashedPassword,
        },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
    return redirect("/");
};

export const handleSignIn = async (
    _: any,
    formData: FormData
): Promise<ActionResult> => {
    // TODO: Create api routes
    const email = formData.get("email") as string;
    const handle = formData.get("handle") as string;
    const password = formData.get("password") as string;

    if (!(email || handle) || !password) {
        return {
            error: "Insufficient credentials provided.",
        };
    }

    let user = null;

    if (email) {
        user = await db.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    if (!user) {
        if (handle) {
            user = await db.user.findUnique({
                where: {
                    handle: handle,
                },
            });
        }
    }

    if (!user) {
        return {
            error: "Invalid email/handle and password",
        };
    }

    const isPasswordValid = await new Argon2id().verify(
        user.hashedPassword,
        password
    );

    if (!isPasswordValid) {
        return {
            error: "Invalid email/handle and password",
        };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
    return redirect("/");
};

export const handleCreateNovel = async (
    _: any,
    formData: FormData
): Promise<ActionResult> => {
    const name = formData.get("name") as string;
    const genre = formData.get("genre") as string;
    const description = formData.get("description") as string;

    if (!name || !genre || !description) {
        return {
            error: "Insufficient data provided.",
        };
    }

    const novel = await api.novel.create.mutate({
        genre: genre,
        name: name,
        description: description,
    });

    return redirect(`/novel/${novel.id}/edit`);
};
