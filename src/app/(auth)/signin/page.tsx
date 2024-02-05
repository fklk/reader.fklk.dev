import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { ActionResult, Form } from "../../_components/form";

export default async function SiginIn() {
    return (
        <>
            <h1>Sign in</h1>
            <Form
                className="flex flex-col gap-4"
                action={handleSignIn}
            >
                <div className="flex gap-8">
                    <div className="flex gap-4">
                        <label htmlFor="email">Email</label>
                        <input
                            className="border border-black rounded-md"
                            type="email"
                            name="email"
                            id="email"
                        />
                    </div>
                    <p>or</p>
                    <div className="flex gap-4">
                        <label htmlFor="handle">Handle</label>
                        <input
                            className="border border-black rounded-md"
                            type="text"
                            name="handle"
                            id="handle"
                        />
                    </div>
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
                    Sign in
                </button>
            </Form>
        </>
    );
}

async function handleSignIn(_: any, formData: FormData): Promise<ActionResult> {
    "use server";

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
}
