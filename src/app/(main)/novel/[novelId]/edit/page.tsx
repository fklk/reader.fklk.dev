import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

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

    const novels = await api.novel.getWrittenByCurrentUser.query();

    if (!novels.map(novel => novel.id).includes(props.params.novelId)) {
        notFound();
    }

    return (
        <div className="mt-8 flex flex-col">
            <h4 className="text-3xl font-bold">{novel.name}</h4>
            <div className="flex flex-wrap justify-between gap-4 mt-4">
                Here you can edit
            </div>
        </div>
    );
}
