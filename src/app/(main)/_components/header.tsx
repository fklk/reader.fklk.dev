import { validateRequest } from "@/lib/auth";
import SubHeader from "./sub-header";

export default async function Header() {
    const { user } = await validateRequest();

    return (
        <header className="w-full h-fit py-4 flex items-center justify-between">
            <SubHeader userHandle={user!.handle} />
        </header>
    );
}
