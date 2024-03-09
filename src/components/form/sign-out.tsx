import { Button } from "@/components/shadcn/button";
import { handleSignOut } from "@/lib/actions";

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
