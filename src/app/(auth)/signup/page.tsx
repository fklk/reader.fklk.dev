import { Form } from "../../../components/form/form";
import { FklkIcon } from "@/components/base/icon";
import { Label } from "@/components/shadcn/label";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import Link from "next/link";
import { handleSignUp } from "@/lib/actions";

export default async function SignUpPage() {
    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <Form
                className="flex flex-col gap-4 bg-secondary/50 py-4 px-12 rounded-lg shadow-lg"
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
