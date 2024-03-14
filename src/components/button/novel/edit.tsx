"use client";

import { Button } from "@/components/shadcn/button";
import { Edit3Icon } from "lucide-react";
import { useRouter } from "next/navigation";

type EditNovelButtonProps = {
    novelId: string;
};

export default function EditNovelButton(props: EditNovelButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/novel/${props.novelId}/edit`);
    };

    return (
        <Button
            size="icon"
            variant="secondary"
            onClick={handleClick}
        >
            <Edit3Icon className="w-5 h-5 box-content" />
        </Button>
    );
}
