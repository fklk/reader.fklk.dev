import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import EditNovelForm from "../../../../../components/form/edit-novel";

type NovelEditPageProps = {
    params: {
        novelId: string;
    };
};

export default async function NovelEditPage(props: NovelEditPageProps) {
    const novel = await api.novel.getById.query({ id: props.params.novelId });

    if (!novel) {
        notFound();
    }

    // TODO: Add functionality to add new chapters

    const novels = await api.novel.getWrittenByCurrentUser.query();
    const genres = await api.genre.getAll.query();

    if (!novels.map(novel => novel.id).includes(props.params.novelId)) {
        notFound();
    }

    return (
        <div className="mt-4 flex flex-col w-full">
            <h4 className="text-3xl font-bold">{novel.name}</h4>
            <EditNovelForm
                novel={novel}
                genres={genres}
            />
        </div>
    );
}
