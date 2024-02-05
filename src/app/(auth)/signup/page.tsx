import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { ActionResult, Form } from "../../_components/form";

export default async function SignUpPage() {
    return (
        <>
            <h1>Sign up</h1>
            <Form
                className="flex flex-col gap-4"
                action={handleSignUp}
            >
                <div className="flex gap-4">
                    <label htmlFor="email">Email</label>
                    <input
                        className="border border-black rounded-md"
                        type="email"
                        name="email"
                        id="email"
                    />
                </div>
                <div className="flex gap-4">
                    <label htmlFor="handle">Handle</label>
                    <input
                        className="border border-black rounded-md"
                        type="text"
                        name="handle"
                        id="handle"
                    />
                </div>
                <div className="flex gap-4">
                    <label htmlFor="password">Password</label>
                    <input
                        className="border border-black rounded-md"
                        type="password"
                        name="password"
                        id="password"
                    />
                </div>
                <br />
                <button className="bg-sky-600 w-fit rounded-lg py-2 px-4 text-xl">
                    Sign up
                </button>
            </Form>
        </>
    );
}

async function handleSignUp(_: any, formData: FormData): Promise<ActionResult> {
    "use server";

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
}
