import { api } from "@/trpc/server";
import CreateNovelForm from "./_components/create-novel-form";

export default async function PublishPage() {
    const genres = await api.genre.getAll.query();

    return (
        <div className="mt-4 flex flex-col w-full">
            <h2 className="text-3xl font-bold">Publish Novel</h2>
            <CreateNovelForm genreNames={genres.map(genre => genre.name)} />
        </div>
    );
}
