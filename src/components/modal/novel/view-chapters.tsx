"use client";

import ChapterCard from "@/components/card/chapter";
import { Button } from "@/components/shadcn/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/shadcn/dialog";
import { Chapter } from "@prisma/client";

type ViewChaptersModalProps = {
    chapters: Chapter[];
};

export default function ViewChaptersModal(props: ViewChaptersModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    variant="ghost"
                >
                    View Chapters
                </Button>
            </DialogTrigger>
            <DialogContent className="px-12 py-8 max-h-96 overflow-y-scroll">
                {props.chapters
                    .sort((a, b) => b.descriptor - a.descriptor)
                    .map(chapter => (
                        <ChapterCard
                            key={chapter.id}
                            chapter={chapter}
                        />
                    ))}
            </DialogContent>
        </Dialog>
    );
}
