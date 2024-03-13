"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/shadcn/avatar";
import Link from "next/link";
import { ReadrIcon } from "@/components/base/icon";
import { Button } from "@/components/shadcn/button";
import { ArrowBigUpDashIcon, SearchIcon } from "lucide-react";
import {
    KeyboardEvent as React_KeyboardEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import { Input } from "@/components/shadcn/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { handleSignOut } from "@/lib/actions";

type SubHeaderProps = {
    userHandle: string;
};

export default function SubHeader(props: SubHeaderProps) {
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchOpenRef = useRef<HTMLButtonElement>(null);

    const role = api.session.getUser.useQuery().data?.role;

    const router = useRouter();

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
                setTimeout(() => {
                    searchInputRef.current?.focus();
                }, 100);
            }
        }

        function handleShowSearchShortcut(event: KeyboardEvent) {
            if (event.key === "S" && event.ctrlKey && event.shiftKey) {
                setShowSearch(!showSearch);
                setTimeout(() => {
                    searchInputRef.current?.focus();
                }, 100);
            }
        }

        function handleHideSearchShortcut(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setShowSearch(false);
            }
        }

        function handleRedirectSiteSettings(event: KeyboardEvent) {
            if (event.key === "L" && event.ctrlKey && event.shiftKey) {
                router.push("/site-settings");
            }
        }

        function handleRedirectProfile(event: KeyboardEvent) {
            if (event.key === "U" && event.ctrlKey && event.shiftKey) {
                router.push("/profile");
            }
        }

        document.addEventListener("click", handleClickOutside);
        document.addEventListener("keydown", handleShowSearchShortcut);
        document.addEventListener("keydown", handleHideSearchShortcut);
        document.addEventListener("keydown", handleRedirectProfile);

        if (role === "ADMIN") {
            document.addEventListener("keydown", handleRedirectSiteSettings);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("keydown", handleShowSearchShortcut);
            document.removeEventListener("keydown", handleHideSearchShortcut);
            document.removeEventListener("keydown", handleRedirectProfile);

            if (role === "ADMIN") {
                document.removeEventListener(
                    "keydown",
                    handleRedirectSiteSettings
                );
            }
        };
    });

    const handleSearch = (e: React_KeyboardEvent<HTMLInputElement>) => {
        if (
            e.key === "Enter" &&
            showSearch &&
            e.currentTarget.value.trim().length > 0
        ) {
            router.push(
                `/search?q=${encodeURIComponent(e.currentTarget.value)}`
            );
            setShowSearch(false);
        }
    };

    return (
        <>
            <div className="flex items-center">
                <Link href="/home">
                    <ReadrIcon
                        height={32}
                        width={32}
                    />
                </Link>
                {showSearch ? null : (
                    <div className="ml-8 flex gap-4 text-md">
                        <Link
                            className="font-medium hover:underline underline-offset-4"
                            href="/home"
                        >
                            Home
                        </Link>
                        <Link
                            className="font-medium hover:underline underline-offset-4"
                            href="/browse"
                        >
                            Browse
                        </Link>
                        <Link
                            className="font-medium hover:underline underline-offset-4"
                            href="/popular"
                        >
                            Popular
                        </Link>
                        <Link
                            className="font-medium hover:underline underline-offset-4"
                            href="/favorites"
                        >
                            Favorites
                        </Link>
                        <Link
                            className="font-medium hover:underline underline-offset-4"
                            href="/insights"
                        >
                            Insights
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
                            ref={searchInputRef}
                            placeholder="Search novels..."
                            className="text-md border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            onKeyDown={e => handleSearch(e)}
                        />
                    </div>
                ) : null}
            </>
            <div className="flex gap-3 items-center">
                {showSearch ? null : (
                    <Link href="/publish">
                        <Button className="flex gap-1 items-center">
                            <ArrowBigUpDashIcon className="w-5 h-5" />
                            Publish
                        </Button>
                    </Link>
                )}
                <div className="flex gap-1">
                    {showSearch ? null : (
                        <Button
                            size="icon"
                            ref={searchOpenRef}
                            variant="ghost"
                        >
                            <SearchIcon className="w-5 h-5" />
                        </Button>
                    )}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="ring-border ring-1 ring-offset-1 ring-offset-background h-8 w-8">
                            <AvatarFallback>
                                {props.userHandle.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <Link href="/profile">
                            <DropdownMenuItem>
                                Profile
                                <DropdownMenuShortcut>
                                    ^&#8679;U
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </Link>
                        {role === "ADMIN" ? (
                            <Link href="/site-settings">
                                <DropdownMenuItem className="flex gap-2">
                                    Site settings
                                    <DropdownMenuShortcut>
                                        ^&#8679;L
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </Link>
                        ) : null}
                        <Link href="/novel/me">
                            <DropdownMenuItem className="flex gap-2">
                                My novels
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleSignOut()}>
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}
