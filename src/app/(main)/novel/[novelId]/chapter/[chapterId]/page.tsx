import { api } from "@/trpc/server";
import { MessageSquareTextIcon } from "lucide-react";
import { notFound } from "next/navigation";

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

    const { fontSize, fontFamily, lineHeight } =
        await api.user.getSettings.query();

    let count = 0;
    //TODO: chapter preview bei publish
    //TODO: Add chapter to readProgress when at bottom of page + show toast when added

    return (
        <>
            <div className="space-y-3 py-8">
                <h1 className="text-3xl font-bold">{chapter.novel.name}</h1>
                <h2 className="text-xl font-semibold">
                    Chapter {chapter.descriptor}: {chapter.name}
                </h2>
                {chapter?.content.split("\\n").map(p => (
                    <p
                        key={count++}
                        className="leading-7 text-justify group"
                    >
                        {p}
                        <span className="inline-flex ml-2 items-center invisible group-hover:visible">
                            <MessageSquareTextIcon className="h-4 w-4" />
                        </span>
                    </p>
                ))}
            </div>
        </>
    );
}
