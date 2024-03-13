"use client";

import { Button } from "@/components/shadcn/button";
import { getBaseUrl } from "@/trpc/shared";
import { Share2Icon } from "lucide-react";
import { toast } from "sonner";

type CopyNovelLinkButtonProps = {
    novelId: string;
};

export default function CopyNovelLinkButton(props: CopyNovelLinkButtonProps) {
    const handleClick = () => {
        navigator.clipboard.writeText(`${getBaseUrl()}/novel/${props.novelId}`);
        toast("Link copied to clipboard");
    };

    return (
        <Button
            size="icon"
            variant="secondary"
            onClick={handleClick}
        >
            <Share2Icon className="w-5 h-5 box-content" />
        </Button>
    );
}
