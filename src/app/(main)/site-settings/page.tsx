import { api } from "@/trpc/server";
import {
    handleCreateGenre,
    handleDeleteChapter,
    handleDeleteComments,
    handleDeleteNovels,
    handleDeleteUsers,
    handleUpdateNovels,
    handleUpdateShowcase,
    handleUpdateUsers,
} from "@/lib/actions";
import SiteSettingsShowcaseCard from "@/components/card/site-settings/showcase";
import SiteSettingsUserCard from "@/components/card/site-settings/user";
import SiteSettingsGenreCard from "@/components/card/site-settings/genre";
import SiteSettingsNovelCard from "@/components/card/site-settings/novel";
import SiteSettingsCommentCard from "@/components/card/site-settings/comment";
import SiteSettingsChapterCard from "@/components/card/site-settings/chapter";

export default async function SiteSettings() {
    const novels = await api.novel.getAll.query({
        include: ["author", "genre"],
    });
    const genres = await api.genre.getAll.query();
    const users = await api.user.getAll.query();
    const comments = await api.comment.getAll.query();
    const chapter = await api.chapter.getAll.query();

    return (
        <div className="mt-4 flex flex-col gap-8">
            <h1 className="text-4xl font-bold">Site Settings</h1>
            <div className="flex gap-8">
                <SiteSettingsShowcaseCard
                    novels={novels}
                    saveAction={handleUpdateShowcase}
                />
                <SiteSettingsUserCard
                    users={users}
                    callout={{
                        message: "Only selected users will be updated",
                        type: "INFO",
                    }}
                    saveAction={handleUpdateUsers}
                    deleteAction={handleDeleteUsers}
                />
                <SiteSettingsGenreCard
                    genres={genres}
                    callout={{
                        message: "Only selected genres will be updated",
                        type: "INFO",
                    }}
                    createAction={handleCreateGenre}
                />
                <SiteSettingsNovelCard
                    novels={novels}
                    saveAction={handleUpdateNovels}
                    deleteAction={handleDeleteNovels}
                />
                <SiteSettingsCommentCard
                    comments={comments}
                    deleteAction={handleDeleteComments}
                />
                <SiteSettingsChapterCard
                    chapter={chapter}
                    deleteAction={handleDeleteChapter}
                />
            </div>
        </div>
    );
}
