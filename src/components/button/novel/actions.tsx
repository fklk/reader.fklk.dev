"use client";

import { Chapter } from "@prisma/client";
import ViewChaptersModal from "../../modal/novel/view-chapters";
import { Button } from "../../shadcn/button";
import { useRouter } from "next/navigation";

type NovelActionsProps = {
    readingVerb: string;
    chapters: Chapter[];
    nextChapter: Chapter | undefined;
};

export default function NovelActions(props: NovelActionsProps) {
    const router = useRouter();

    return (
        <div className="flex gap-4">
            <Button
                size="lg"
                disabled={!props.nextChapter}
                onClick={() =>
                    router.push(
                        `/novel/${props.chapters.at(0)?.novelId}/chapter/${
                            props.nextChapter?.id
                        }`
                    )
                }
            >
                {props.readingVerb} Reading
            </Button>
            <ViewChaptersModal chapters={props.chapters} />
        </div>
    );
}
