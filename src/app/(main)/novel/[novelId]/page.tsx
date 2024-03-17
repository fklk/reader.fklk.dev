import NovelActions from "@/components/button/novel/actions";
import CopyNovelLinkButton from "@/components/button/novel/copy-link";
import EditNovelButton from "@/components/button/novel/edit";
import NovelInfoCard from "@/components/card/novel/info";
import AddCommentModal from "@/components/modal/novel/add-comment";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import EnableNovelInsightsModal from "@/components/modal/novel/enable-insights";
import HandleNovelListButton from "@/components/button/novel/handle-list";
import { getUser } from "@/lib/auth";

type NovelPageProps = {
    params: {
        novelId: string;
    };
};

export default async function NovelPage(props: NovelPageProps) {
    const novel = await api.novel.getById.query({
        id: props.params.novelId,
        include: ["author", "genre", "chapters"],
    });

    const user = await getUser();

    if (!novel) {
        notFound();
    }

    await api.novel.incrementView.mutate({ id: props.params.novelId });

    const chapters = await api.chapter.getAllForNovels.query({
        novelIds: [props.params.novelId],
    });

    const readingProgress = await api.user.getReadingProgress.query({
        include: ["chapter"],
    });
    const readingProgressForNovel = readingProgress.filter(
        rp => rp.novelId === props.params.novelId
    );

    const lastChapterRead = readingProgressForNovel
        .sort((a, b) => b.chapter.descriptor - a.chapter.descriptor)
        .at(0)?.chapter;

    const chapterNeighbors = await api.chapter.getNeighbors.query({
        novelId: props.params.novelId,
        descriptor: lastChapterRead?.descriptor ?? -1,
    });

    const areInsightsEnabled = await api.insight.isEnabled.query({
        novelId: props.params.novelId,
    });

    const userListNovelIds = await api.user.getListNovelIds.query();

    const comments = await api.comment.getForNovel.query({
        novelId: props.params.novelId,
    });

    return (
        <div className="flex h-[90vh] gap-12 mt-4 justify-between relative">
            <div
                className="absolute h-[35rem] filter grayscale hover:grayscale-0 rounded-md overflow-hidden aspect-[9/16] right-0"
                style={{
                    background: `url('${novel.imgPath}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            ></div>
            <div className="w-1/2 flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                        <h1 className="text-4xl font-bold w-1/2 text-wrap">
                            {novel.name}
                        </h1>
                        <div className="flex gap-2">
                            <HandleNovelListButton
                                isOnList={userListNovelIds.includes(
                                    props.params.novelId
                                )}
                                novelId={props.params.novelId}
                            />
                            {areInsightsEnabled ? null : (
                                <EnableNovelInsightsModal novelId={novel.id} />
                            )}
                            <AddCommentModal
                                novelId={novel.id}
                                comments={comments}
                            />
                            <CopyNovelLinkButton novelId={novel.id} />
                            {user!.id === novel.authorId && (
                                <EditNovelButton novelId={novel.id} />
                            )}
                        </div>
                    </div>
                    <NovelInfoCard novel={novel} />
                    <p className="mt-4">{novel.description}</p>
                </div>
                <NovelActions
                    chapters={chapters}
                    nextChapter={chapterNeighbors.next}
                    readingVerb={
                        readingProgress.find(
                            rp => rp.novelId === props.params.novelId
                        )
                            ? "Continue"
                            : "Start"
                    }
                />
            </div>
        </div>
    );
}
