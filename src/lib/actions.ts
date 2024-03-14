"use server";

import { ActionResult } from "@/components/form/form";
import { api } from "@/trpc/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { lucia, validateRequest } from "./auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";
import { writeFile, rm } from "fs/promises";
import { UserRole } from "@prisma/client";

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

// Source: https://lucia-auth.com/
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

// Source: https://lucia-auth.com/
// Adjusted to meet requirements
export const handleSignUp = async (
    _: any,
    formData: FormData
): Promise<ActionResult> => {
    const email = formData.get("email") as string;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return {
            error: "Email does not match requirements",
        };
    }

    const handle = formData.get("handle") as string;

    if (handle.length < 4) {
        return {
            error: "Handle should be at least 4 characters long",
        };
    }

    const password = formData.get("password") as string;

    if (password.length < 5) {
        return {
            error: "Password should be at least 5 characters long",
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

// Source: https://lucia-auth.com/
// Adjusted to meet requirements
export const handleSignIn = async (
    _: any,
    formData: FormData
): Promise<ActionResult> => {
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
    const coverFile = formData.get("cover") as File;

    if (!name || !genre || !description || !coverFile) {
        return {
            error: "Insufficient data provided.",
        };
    }

    const novel = await api.novel.create.mutate({
        genre: genre,
        name: name,
        description: description,
    });

    const coverBytes = await coverFile.arrayBuffer();
    const coverBuffer = Buffer.from(coverBytes);
    const coverFileExtension = coverFile.type.split("/")[1];
    const publicPath = `/cover/${novel.id}.${coverFileExtension}`;
    const coverPath = `${process.cwd()}/public${publicPath}`;
    await writeFile(coverPath, coverBuffer);

    await api.novel.setImgPath.mutate({ id: novel.id, imgPath: publicPath });

    return redirect(`/novel/${novel.id}/edit`);
};

export const handleUpdateNovel = async (
    _: any,
    formData: FormData
): Promise<ActionResult> => {
    const name = formData.get("name") as string;
    const genre = formData.get("genre") as string;
    const novelId = formData.get("novelId") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const coverFile = formData.get("cover") as File;

    let imgPath = undefined;

    if (coverFile.size > 0) {
        const coverBytes = await coverFile.arrayBuffer();
        const coverBuffer = Buffer.from(coverBytes);
        const coverFileExtension = coverFile.type.split("/")[1];
        const publicPath = `/cover/${novelId}.${coverFileExtension}`;
        const coverPath = `${process.cwd()}/public${publicPath}`;
        rm(coverPath).then(async () => {
            await writeFile(coverPath, coverBuffer);
        });
        imgPath = publicPath;
    }

    await api.novel.update.mutate({
        id: novelId,
        genre: genre,
        name: name,
        status: status,
        description: description,
        imgPath: imgPath,
    });

    return { error: "" };
};

export const handleUpdateShowcase = async (novelIds: string[], _: FormData) => {
    await api.novel.purgeShowcases.mutate();
    await api.novel.setShowcaseNovels.mutate({ ids: novelIds });

    return revalidatePath("/");
};

export const handleDeleteUsers = async (userIds: string[], _: FormData) => {
    await api.user.delete.mutate({ ids: userIds });

    return revalidatePath("/");
};

export const handleUpdateUsers = async (
    userIds: string[],
    formData: FormData
) => {
    userIds.forEach(async id => {
        await api.user.update.mutate({
            id: id,
            handle: formData.get(`handle_${id}`)! as string,
            email: formData.get(`email_${id}`)! as string,
            role: formData
                .get(`role_${id}`)
                ?.toString()
                .toUpperCase() as UserRole,
        });
    });
    return revalidatePath("/");
};

export const handleCreateGenre = async (_: string[], formData: FormData) => {
    await api.genre.create.mutate({ name: formData.get("name") as string });

    return revalidatePath("/");
};

export const handleDeleteNovels = async (novelIds: string[], _: FormData) => {
    await api.novel.delete.mutate({ ids: novelIds });
    return revalidatePath("/");
};

export const handleUpdateNovels = async (
    novelIds: string[],
    formData: FormData
) => {
    novelIds.forEach(async id => {
        await api.novel.updateBulk.mutate({
            id: id,
            name: formData.get(`name_${id}`)! as string,
            description: formData.get(`description_${id}`)! as string,
        });
    });
    return revalidatePath("/");
};

export const handleDeleteComments = async (
    commentIds: string[],
    _: FormData
) => {
    await api.comment.delete.mutate({ ids: commentIds });
    return revalidatePath("/");
};

export const handleDeleteChapter = async (
    chapterIds: string[],
    _: FormData
) => {
    await api.chapter.delete.mutate({ ids: chapterIds });
    return revalidatePath("/");
};

export const handleUpdateProfile = async (_: any, formData: FormData) => {
    await api.user.updateSelf.mutate({
        email: formData.get("email") as string,
        handle: formData.get("handle") as string,
    });

    return { error: "" };
};

export const handleCreateChapter = async (_: any, formData: FormData) => {
    const novelId = formData.get("novelId") as string;

    const latestChapter = await api.chapter.getLatestForNovel.query({
        novelId: novelId,
    });

    const nextDescriptor = latestChapter ? latestChapter.descriptor + 1 : 0;

    await api.chapter.create.mutate({
        novelId: novelId,
        descriptor: nextDescriptor,
        name: formData.get("name") as string,
        content: formData.get("content") as string,
    });

    return { error: "" };
};

export const handleInsightCreate = async (_: any, formData: FormData) => {
    await api.insight.createGlobal.mutate({
        novelId: formData.get("novelId") as string,
        content: formData.get("content") as string,
        trigger: formData.get("trigger") as string,
        chapterId: formData.get("chapterId") as string,
    });

    return { error: "" };
};
