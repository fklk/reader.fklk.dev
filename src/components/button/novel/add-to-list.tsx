"use client";

import { Button } from "@/components/shadcn/button";
import { api } from "@/trpc/react";
import { PlusIcon } from "lucide-react";

type AddNovelToListButtonProps = {
    novelId: string;
    onClick: () => void;
};

export default function AddNovelToListButton(props: AddNovelToListButtonProps) {
    const addToListMutation = api.user.addNovelToList.useMutation();

    const handleClick = () => {
        addToListMutation.mutate({ novelId: props.novelId });
        props.onClick();
    };

    return (
        <Button
            size="icon"
            variant="secondary"
            onClick={handleClick}
        >
            <PlusIcon className="w-5 h-5 box-content" />
        </Button>
    );
}
