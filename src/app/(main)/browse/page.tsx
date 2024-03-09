import { api } from "@/trpc/server";
import NovelCard from "../../../components/card/novel";
import Selector from "../../../components/selector/selector";

type BrowsePageProps = {
    searchParams: {
        genre: string | undefined;
        author: string | undefined;
        minChapter: string | undefined;
    };
};

export default async function BrowsePage(props: BrowsePageProps) {
    const genres = await api.genre.getAll.query();
    const authors = await api.user.getAllAuthors.query();
    const minMax = await api.chapter.getMinMax.query();

    const novelIdsByPopularity = await api.novel.getAllByPopularity.query({
        genre: props.searchParams.genre,
        author: props.searchParams.author,
        minChapter: props.searchParams.minChapter
            ? parseInt(props.searchParams.minChapter)
            : undefined,
    });

    return (
        <div className="flex flex-col flex-grow gap-8 pb-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold">Filter</h1>
                <div className="flex gap-8">
                    <Selector
                        name="genre"
                        urlParam="genre"
                        items={genres.map(genre => genre.name)}
                        errorMessage="No genres found"
                        defaultValue={props.searchParams.genre ?? ""}
                    />
                    <Selector
                        name="author"
                        urlParam="author"
                        items={authors.map(author => author.handle)}
                        errorMessage="No authors found"
                        defaultValue={props.searchParams.author ?? ""}
                    />
                    <Selector
                        name="min chapters"
                        urlParam="minChapter"
                        items={Array.from({
                            length: minMax.maxChapters - minMax.minChapters + 1,
                        }).map((_, i) => i.toString())}
                        errorMessage="Invalid number"
                        defaultValue={props.searchParams.minChapter ?? ""}
                    />
                </div>
            </div>
            <div className="flex flex-grow gap-8 flex-wrap">
                {novelIdsByPopularity.map(novelId => (
                    <NovelCard
                        key={novelId}
                        novelId={novelId}
                        redirectTo="NOVEL_PAGE"
                    />
                ))}
                {novelIdsByPopularity.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <h3 className="text-xl text-muted-foreground">
                            No novels meet the given criteria.
                        </h3>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
