"use client";

import { Chapter } from "@prisma/client";
import { Card, CardContent, CardHeader } from "../shadcn/card";
import { formatDuration } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ChapterCardProps = {
    chapter: Chapter;
};

export default function ChapterCard({ chapter }: ChapterCardProps) {
    const router = useRouter();

    return (
        <Card
            className="hover:bg-secondary"
            onClick={() =>
                router.push(`/novel/${chapter.novelId}/chapter/${chapter.id}`)
            }
        >
            <CardContent className="flex flex-col py-6 px-8 gap-1">
                <h2>
                    <span className="font-bold">
                        Chapter {chapter.descriptor}:
                    </span>{" "}
                    {chapter.name}
                </h2>
                <p className="text-muted-foreground">
                    {formatDuration(chapter.createdAt)}
                </p>
            </CardContent>
        </Card>
    );
}
