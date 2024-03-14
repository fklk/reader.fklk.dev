import Showcase from "@/components/base/showcase";
import NovelCard from "@/components/card/novel/novel";
import { api } from "@/trpc/server";

export default async function Home() {
    const readingProgress = await api.user.getReadingProgress.query({
        include: ["novel", "chapter"],
    });

    const novelIds = Array.from(new Set(readingProgress.map(rp => rp.novelId)));

    const showcaseNovels = await api.novel.getShowcaseNovels.query();

    return (
        <div>
            <Showcase novels={showcaseNovels} />
            <div className="mt-10">
                <h1 className="text-2xl font-bold">Continue Reading</h1>
                {readingProgress.length > 0 ? (
                    <>
                        <div className="flex gap-8 overflow-x-scroll py-2 px-2">
                            {novelIds.map(novelId => (
                                <NovelCard
                                    key={novelId}
                                    novelId={novelId}
                                    redirectTo="NOVEL_PAGE"
                                />
                            ))}
                            {novelIds.length === 0 ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <h3 className="text-lg text-muted-foreground">
                                        There currently are no updates.
                                    </h3>
                                </div>
                            ) : null}
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <h3 className="text-lg text-muted-foreground">
                            Start reading to see updates here.
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
}
