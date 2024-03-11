import EditProfileForm from "@/components/form/edit-profile";
import { getUser } from "@/lib/auth";

export default async function ProfilePage() {
    const user = await getUser();

    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold">Profile</h1>
            <EditProfileForm user={user!} />
        </div>
    );
}
