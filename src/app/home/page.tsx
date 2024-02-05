import { validateRequest } from "@/lib/auth";

export default async function Home() {
    const { user } = await validateRequest();

    return (
        <div className="min-h-screen flex justify-center items-center">
            <h1 className="text-5xl font-black">Hello {user!.handle}!</h1>
        </div>
    );
}
