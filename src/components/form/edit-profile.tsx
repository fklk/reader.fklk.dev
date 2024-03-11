"use client";

import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Button } from "@/components/shadcn/button";
import { Form } from "@/components/form/form";
import { handleUpdateProfile } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { User } from "lucia";
import { Badge } from "../shadcn/badge";

type EditProfileFormProps = {
    user: User;
};

export default function EditProfileForm(props: EditProfileFormProps) {
    const router = useRouter();

    const handleUpdate = (prevState: any, formData: FormData) => {
        const res = handleUpdateProfile(prevState, formData);
        router.refresh();
        return res;
    };

    return (
        <Form
            action={handleUpdate}
            className="mt-8 flex flex-col gap-4 place-content-between w-1/3"
        >
            <div className="flex justify-between items-center">
                <Label
                    className="text-lg"
                    htmlFor="handle"
                >
                    Handle
                </Label>
                <Input
                    type="text"
                    id="handle"
                    name="handle"
                    className="w-80"
                    defaultValue={props.user.handle}
                />
            </div>
            <div className="flex justify-between items-center">
                <Label
                    className="text-lg"
                    htmlFor="email"
                >
                    Email
                </Label>
                <Input
                    type="text"
                    id="email"
                    name="email"
                    className="w-80"
                    defaultValue={props.user.email}
                />
            </div>
            <div className="flex justify-between items-center">
                <Label
                    className="text-lg"
                    htmlFor="role"
                >
                    Role
                </Label>
                <Badge>{props.user.role}</Badge>
            </div>
            <Button type="submit">Update</Button>
        </Form>
    );
}
