"use client";

import { Button } from "@/components/shadcn/button";
import { api } from "@/trpc/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import AddNovelToListButton from "./add-to-list";
import RemoveNovelFromListButton from "./remove-from-list";

type HandleNovelListButtonProps = {
    novelId: string;
    isOnList: boolean;
};

export default function HandleNovelListButton(
    props: HandleNovelListButtonProps
) {
    const [isOnList, setIsOnList] = useState<boolean>(props.isOnList);

    return (
        <>
            {isOnList ? (
                <RemoveNovelFromListButton
                    novelId={props.novelId}
                    onClick={() => setIsOnList(false)}
                />
            ) : (
                <AddNovelToListButton
                    novelId={props.novelId}
                    onClick={() => setIsOnList(true)}
                />
            )}
        </>
    );
}
