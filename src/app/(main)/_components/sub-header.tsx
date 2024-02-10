"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/app/_components/ui/avatar";
import Link from "next/link";
import { ReadrIcon } from "@/app/_components/icon";
import { Button } from "@/app/_components/ui/button";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/app/_components/ui/input";

type SubHeaderProps = {
    userHandle: string;
};

export default function SubHeader(props: SubHeaderProps) {
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchOpenRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                if (!searchOpenRef.current) {
                    setShowSearch(false);
                }
            }

            // onClick of searchOpenRef needs to be handled here instead of at `onClick()` on its current,
            // because it would otherwise interfere with the code above
            if (searchOpenRef.current?.contains(event.target as Node)) {
                setShowSearch(true);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="flex items-center">
                <ReadrIcon
                    height={32}
                    width={32}
                />
                {showSearch ? null : (
                    <div className="ml-8 flex gap-4 text-md">
                        <Link
                            className="font-medium hover:underline underline-offset-4"
                            href=""
                        >
                            Home
                        </Link>
                        <Link
                            className="font-medium hover:underline underline-offset-4"
                            href=""
                        >
                            Browse
                        </Link>
                        <Link
                            className="font-medium hover:underline underline-offset-4"
                            href=""
                        >
                            Popular
                        </Link>
                    </div>
                )}
            </div>
            <>
                {showSearch ? (
                    <div
                        ref={searchRef}
                        className="w-1/2 ring-1 ring-primary flex rounded-md items-center px-2"
                    >
                        <SearchIcon className="h-5 w-5" />
                        <Input
                            placeholder="Search novels..."
                            className="text-md border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                ) : null}
            </>
            <div className="flex gap-6 items-center">
                {showSearch ? null : (
                    <Button
                        size="icon"
                        ref={searchOpenRef}
                        variant="ghost"
                    >
                        <SearchIcon className="w-5 h-5" />
                    </Button>
                )}
                <Avatar className="ring-border ring-1 ring-offset-1 ring-offset-background h-8 w-8">
                    <AvatarImage src="https://avatars.githubusercontent.com/u/85395498?v=4" />
                    <AvatarFallback>
                        {props.userHandle.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
        </>
    );
}
