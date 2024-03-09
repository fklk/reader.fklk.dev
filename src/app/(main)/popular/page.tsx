import { api } from "@/trpc/server";
import React from "react";
import NovelCard from "../../../components/card/novel";

export default async function PopularPage() {
    const novelIdsByPopularity = await api.novel.getAllByPopularity.query({
        limit: 16,
    });

    return (
        <div className="flex flex-col gap-6 mt-8">
            <h1 className="text-3xl font-bold">Popular novels</h1>
            <div className="flex gap-8 pt-2 pb-8 px-2 flex-wrap">
                {novelIdsByPopularity?.map(novelId => (
                    <NovelCard
                        key={novelId}
                        novelId={novelId}
                        redirectTo="NOVEL_PAGE"
                    />
                ))}
            </div>
        </div>
    );
}
