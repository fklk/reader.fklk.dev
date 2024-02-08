import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ActionResult } from "@/app/_components/form";
import { Button } from "@/app/_components/ui/button";

export default async function SignOutButton({
    className,
}: {
    className?: string;
}) {
    return (
        <form action={handleSignOut}>
            <Button
                variant="secondary"
                className={className}
            >
                Sign out
            </Button>
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
    return redirect("/signin");
}
