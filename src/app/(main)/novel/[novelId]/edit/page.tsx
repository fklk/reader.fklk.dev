import NovelEditCard from "@/components/card/novel/edit";
import AddChapterForm from "@/components/form/add-chapter";
import AddInsightForm from "@/components/form/add-insight";
import EditNovelForm from "@/components/form/edit-novel";
import { getUser } from "@/lib/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

type NovelEditPageProps = {
    params: {
        novelId: string;
    };
};

export default async function NovelEditPage(props: NovelEditPageProps) {
    const novel = await api.novel.getById.query({ id: props.params.novelId });

    const user = await getUser();

    if (!novel || novel.authorId !== user?.id) {
        notFound();
    }

    const novels = await api.novel.getWrittenByCurrentUser.query();
    const genres = await api.genre.getAll.query();

    const chapters = await api.chapter.getAllForNovels.query({
        novelIds: [props.params.novelId],
    });

    const latestChapter = chapters.at(-1);

    if (!novels.map(novel => novel.id).includes(props.params.novelId)) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-4 mt-8">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold">Settings</h1>
                <h2 className="text-2xl font-semibold">{novel.name}</h2>
            </div>
            <div className="flex gap-4 place-items-start">
                <NovelEditCard title="Update Novel">
                    <EditNovelForm
                        novel={novel}
                        genres={genres}
                    />
                </NovelEditCard>
                <NovelEditCard title="Add Chapter">
                    <AddChapterForm
                        novel={novel}
                        nextDescriptor={
                            latestChapter ? latestChapter.descriptor + 1 : 0
                        }
                    />
                </NovelEditCard>
                {chapters.length > 0 && (
                    <NovelEditCard title="Add Insight">
                        <AddInsightForm
                            novelId={novel.id}
                            chapters={chapters}
                        />
                    </NovelEditCard>
                )}
            </div>
        </div>
    );
}
