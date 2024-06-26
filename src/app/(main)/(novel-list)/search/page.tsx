import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import NovelCard from "@/components/card/novel/novel";

type SearchPageProps = {
    searchParams: {
        q: string | undefined;
    };
};

export default async function SearchPage(props: SearchPageProps) {
    if (!props.searchParams || !props.searchParams.q) {
        redirect("/home");
    }

    const matchingNovels = await api.novel.getMatches.query({
        query: props.searchParams.q,
    });

    return (
        <>
            <h1 className="text-3xl font-bold">
                Found {matchingNovels.length}{" "}
                {matchingNovels.length === 1 ? "result" : "results"}
            </h1>
            <div className="flex gap-8 pt-2 pb-8 px-2 flex-wrap">
                {matchingNovels?.map(novel => (
                    <NovelCard
                        key={novel.id}
                        novelId={novel.id}
                        redirectTo="NOVEL_PAGE"
                    />
                ))}
            </div>
        </>
    );
}
