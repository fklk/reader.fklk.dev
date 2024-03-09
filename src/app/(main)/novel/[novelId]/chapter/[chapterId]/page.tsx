import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import ChapterContent from "../../../../../../components/base/chapter-content";
import { Button } from "@/components/shadcn/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

type NovelChapterPageProps = {
    params: {
        novelId: string;
        chapterId: string;
    };
};

export default async function NovelChapterPage(props: NovelChapterPageProps) {
    const chapter = await api.chapter.getById.query({
        id: props.params.chapterId,
        include: ["novel"],
    });

    if (!chapter) {
        notFound();
    }

    const { prev, next } = await api.chapter.getNeighbors.query({
        novelId: props.params.novelId,
        descriptor: chapter.descriptor,
    });

    const insights = await api.insight.getAllForId.query({
        chapterId: props.params.chapterId,
        novelId: props.params.novelId,
    });

    const readingProgress = await api.user.getReadingProgress.query({
        include: ["novel", "chapter"],
    });

    const isRead = !!readingProgress.find(
        rp =>
            rp.chapterId === props.params.chapterId &&
            rp.novelId === props.params.novelId
    );

    return (
        <>
            <div className="space-y-3 py-8">
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold">{chapter.novel.name}</h1>
                    <div className="flex gap-3">
                        <Link
                            href={
                                prev
                                    ? `/novel/${props.params.novelId}/chapter/${prev.id}`
                                    : ""
                            }
                            className={`${!prev ? "cursor-not-allowed" : ""}`}
                        >
                            <Button
                                size="icon"
                                disabled={!prev}
                            >
                                <ChevronLeftIcon />
                            </Button>
                        </Link>
                        <Link
                            href={
                                next
                                    ? `/novel/${props.params.novelId}/chapter/${next.id}`
                                    : ""
                            }
                            className={`${!next ? "cursor-not-allowed" : ""}`}
                        >
                            <Button
                                size="icon"
                                disabled={!next}
                            >
                                <ChevronRightIcon />
                            </Button>
                        </Link>
                    </div>
                </div>
                <h2 className="text-xl font-semibold">
                    Chapter {chapter.descriptor}: {chapter.name}
                </h2>
                <ChapterContent
                    content={chapter.content}
                    insights={insights}
                    chapterId={props.params.chapterId}
                    novelId={props.params.novelId}
                    isRead={isRead}
                />
            </div>
        </>
    );
}
