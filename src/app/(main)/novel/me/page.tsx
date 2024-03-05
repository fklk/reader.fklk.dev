import { api } from "@/trpc/server";
import NovelCard from "../../_components/novel-card";

export default async function MyNovelPage() {
    const novels = await api.novel.getWrittenByCurrentUser.query();

    return (
        <div className="mt-8 flex flex-col">
            <h4 className="text-3xl font-bold">My Novels</h4>
            <div className="flex flex-wrap justify-start gap-4 mt-4">
                {novels.map(novel => (
                    <NovelCard
                        key={novel.id}
                        novelId={novel.id}
                        redirectTo="NOVEL_PAGE"
                    />
                ))}
            </div>
        </div>
    );
}
