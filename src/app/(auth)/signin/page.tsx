import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { ActionResult, Form } from "../../_components/form";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/app/_components/ui/tabs";
import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { FklkIcon } from "@/app/_components/icon";
import { handleSignIn } from "@/lib/actions";

export default async function SiginIn() {
    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <Form
                className="flex flex-col gap-4 bg-gray-200 py-4 px-12 rounded-lg shadow-lg"
                action={handleSignIn}
            >
                <div className="flex flex-col gap-2">
                    <FklkIcon
                        width={50}
                        height={50}
                    />
                    <h1 className="text-3xl font-bold">Sign in</h1>
                </div>
                <div className="flex gap-8 mt-6">
                    <Tabs defaultValue="email">
                        <TabsList className="bg-primary/10">
                            <TabsTrigger value="email">Email</TabsTrigger>
                            <TabsTrigger value="handle">Handle</TabsTrigger>
                        </TabsList>
                        <TabsContent value="email">
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
                        </TabsContent>
                        <TabsContent value="handle">
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
                        </TabsContent>
                    </Tabs>
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
                <Button>Sign in</Button>
                <div className="mt-4 text-sm flex items-center flex-col gap-2 pb-2">
                    <Link
                        className="hover:underline underline-offset-4 text-primary"
                        href="/"
                    >
                        Forgot password?
                    </Link>
                    <Link
                        className="hover:underline underline-offset-4 text-primary"
                        href="/signup"
                    >
                        Sign up
                    </Link>
                </div>
            </Form>
        </div>
    );
}
