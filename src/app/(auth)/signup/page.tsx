import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { ActionResult, Form } from "../../_components/form";
import { FklkIcon } from "@/app/_components/icon";
import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

export default async function SignUpPage() {
    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <Form
                className="flex flex-col gap-4 bg-secondary py-4 px-12 rounded-lg shadow-lg"
                action={handleSignUp}
            >
                <div className="flex flex-col gap-2">
                    <FklkIcon
                        width={50}
                        height={50}
                    />
                    <h1 className="text-3xl font-bold">Sign up</h1>
                </div>
                <div className="flex flex-col gap-1">
                    <Label
                        className="text-md"
                        htmlFor="email"
                    >
                        Email
                    </Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        className="w-80"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label
                        className="text-md"
                        htmlFor="handle"
                    >
                        Handle
                    </Label>
                    <Input
                        type="text"
                        id="handle"
                        name="handle"
                        className="w-80"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label
                        className="text-md"
                        htmlFor="password"
                    >
                        Password
                    </Label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        className="w-80"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label
                        className="text-md"
                        htmlFor="repeatedPassword"
                    >
                        Repeat Password
                    </Label>
                    <Input
                        type="password"
                        name="repeatedPassword"
                        id="repeatedPassword"
                        className="w-80"
                    />
                </div>
                <Button>Sign up</Button>
                <div className="mt-4 text-sm flex items-center flex-col gap-2 pb-2">
                    <Link
                        className="hover:underline underline-offset-4 text-primary"
                        href="/signin"
                    >
                        Already have an account?
                    </Link>
                </div>
            </Form>
        </div>
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
}
