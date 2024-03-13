"use client";

import { Button } from "@/components/shadcn/button";
import { api } from "@/trpc/react";
import { PlusIcon, XIcon } from "lucide-react";

type RemoveNovelFromListButtonProps = {
    novelId: string;
    onClick: () => void;
};

export default function RemoveNovelFromListButton(
    props: RemoveNovelFromListButtonProps
) {
    const removeFromListMutation = api.user.removeNovelFromList.useMutation();

    const handleClick = () => {
        removeFromListMutation.mutate({ novelId: props.novelId });
        props.onClick();
    };

    return (
        <Button
            size="icon"
            variant="secondary"
            onClick={handleClick}
        >
            <XIcon className="w-5 h-5 box-content" />
        </Button>
    );
}
