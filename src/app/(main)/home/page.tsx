import { api } from "@/trpc/server";
import NovelCard from "../../../components/card/novel";
import Showcase from "../../../components/base/showcase";

export default async function Home() {
    const readingProgress = await api.user.getReadingProgress.query({
        include: ["novel", "chapter"],
    });

    // Delete duplicates with Set
    const novelIds = Array.from(new Set(readingProgress.map(rp => rp.novelId)));

    const showcaseNovels = await api.novel.getShowcaseNovels.query();

    // TODO: Display info text, when no reading progress or new chapters are there
    // ==> When no reading progress: "Start reading to see new updates here"
    // ==> When just no new updates: "There are curretnly no new updates"

    return (
        <div>
            <Showcase novels={showcaseNovels} />
            <div className="mt-10">
                {readingProgress ? (
                    <>
                        <h1 className="text-2xl font-bold">Continue Reading</h1>
                        <div className="flex gap-8 overflow-x-scroll py-2 px-2">
                            {novelIds.map(novelId => (
                                <NovelCard
                                    key={novelId}
                                    novelId={novelId}
                                    redirectTo="NOVEL_PAGE"
                                />
                            ))}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
