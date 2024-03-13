import { api } from "@/trpc/server";
import React from "react";
import NovelCard from "../../../../components/card/novel/novel";

export default async function FavoritesPage() {
    const favoriteNovelIds = await api.user.getListNovelIds.query();

    return (
        <>
            <h1 className="text-3xl font-bold">Favorites</h1>
            <div className="flex gap-8 pt-2 pb-8 px-2 flex-wrap">
                {favoriteNovelIds?.map(novelId => (
                    <NovelCard
                        key={novelId}
                        novelId={novelId}
                        redirectTo="NOVEL_PAGE"
                    />
                ))}
            </div>
        </>
    );
}
