import Link from "next/link";
import { FklkIcon, ReadrIcon } from "./_components/icon";
import { Button } from "./_components/ui/button";
import { Separator } from "./_components/ui/separator";
import {
    HomeIcon,
    BookTextIcon,
    BlocksIcon,
    LightbulbIcon,
    FolderKanbanIcon,
    ChevronLeftIcon,
} from "lucide-react";

export default async function LandingPage() {
    return (
        <div className="flex items-center w-full justify-between">
            <div className="flex flex-col gap-28">
                <FklkIcon
                    width={75}
                    height={75}
                />
                <div className="flex gap-12">
                    <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% p-12 rounded-2xl shadow-xl">
                        <ReadrIcon
                            className="text-white"
                            width={250}
                            height={250}
                        />
                    </div>
                    <div className="place-self-center">
                        <h1 className="font-bold text-9xl">ReadR</h1>
                        <p className="text-5xl text-secondary-foreground">
                            Read what you enjoy,
                            <br />
                            publish what you create
                        </p>
                    </div>
                </div>
                <div className="flex gap-4 items-center ">
                    <Link href="/signin">
                        <Button
                            className="text-3xl py-7 px-4"
                            variant="default"
                        >
                            Sign in
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button
                            className="text-3xl py-7 px-4"
                            variant="outline"
                        >
                            Sign up
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-5 text-3xl font-medium text-center">
                <Link
                    className="flex gap-2 items-center group"
                    href="https://fklk.dev"
                >
                    <HomeIcon />
                    Home
                    <ChevronLeftIcon className="group-hover:visible invisible" />
                </Link>
                <Separator className="h-[2px] " />
                <Link
                    className="flex gap-2 items-center group"
                    href="https://readr.fklk.dev"
                >
                    <BookTextIcon />
                    ReadR
                    <ChevronLeftIcon className="group-hover:visible invisible" />
                </Link>
                <Separator className="h-[2px] " />
                <Link
                    className="flex gap-2 items-center group"
                    href="https://buildr.fklk.dev"
                >
                    <BlocksIcon />
                    BuildR
                    <ChevronLeftIcon className="group-hover:visible invisible" />
                </Link>
                <Separator className="h-[2px] " />
                <Link
                    className="flex gap-2 items-center group"
                    href="https://plottr.fklk.dev"
                >
                    <FolderKanbanIcon />
                    PlottR
                    <ChevronLeftIcon className="group-hover:visible invisible" />
                </Link>
                <Separator className="h-[2px] " />
                <Link
                    className="flex gap-2 items-center group"
                    href="https://idear.fklk.dev"
                >
                    <LightbulbIcon />
                    IdeaR
                    <ChevronLeftIcon className="group-hover:visible invisible " />
                </Link>
            </div>
        </div>
    );
}
