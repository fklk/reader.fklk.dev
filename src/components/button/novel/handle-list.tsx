"use client";

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
