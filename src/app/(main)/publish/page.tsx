import CreateNovelForm from "@/components/form/create-novel";
import { api } from "@/trpc/server";

export default async function PublishPage() {
    const genres = await api.genre.getAll.query();

    return (
        <div className="mt-4 flex flex-col w-full">
            <h2 className="text-3xl font-bold">Publish Novel</h2>
            <CreateNovelForm genreNames={genres.map(genre => genre.name)} />
        </div>
    );
}
