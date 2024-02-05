import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ActionResult } from "@/app/_components/form";

export default async function SignOutButton() {
    return (
        <form action={handleSignOut}>
            <button>Sign out</button>
        </form>
    );
}

async function handleSignOut(): Promise<ActionResult> {
    "use server";
    const { session } = await validateRequest();
    if (!session) {
        return {
            error: "Unauthorized",
        };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
    return redirect("/login");
}
