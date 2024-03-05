"use client";

import SiteSettingModal from "@/components/modal/site-setting/modal";
import SettingsCard from "@/components/card/site-settings/settings-card";
import { CalloutType } from "@/app/_components/callout";
import { Chapter, Novel, User } from "@prisma/client";
import { columns } from "@/config/tables/site-settings/chapter";

type SiteSettingsCapterCard = {
    chapter: (Chapter & { novel: Novel & { author: User } })[];
    callout?: {
        type: CalloutType;
        message: string;
    };
    deleteAction: (ids: string[], formData: FormData) => Promise<void>;
};

export default function SiteSettingsChapterCard(props: SiteSettingsCapterCard) {
    return (
        <SettingsCard
            title="Chapter"
            callout={props.callout}
        >
            <SiteSettingModal
                tableColumns={columns}
                tableFilters={[
                    {
                        displayName: "author",
                        accessorName: "authorName",
                        renderAs: "SELECTOR",
                        items: Array.from(
                            new Set(
                                props.chapter.map(
                                    chapter => chapter.novel.author.handle
                                )
                            )
                        ),
                    },
                    {
                        displayName: "novel",
                        accessorName: "novelName",
                        renderAs: "SELECTOR",
                        items: Array.from(
                            new Set(
                                props.chapter.map(chapter => chapter.novel.name)
                            )
                        ),
                    },
                ]}
                tableItems={props.chapter.map(chapter => ({
                    ...chapter,
                    novelName: chapter.novel.name,
                    authorName: chapter.novel.author.handle,
                }))}
                deleteAction={props.deleteAction}
            />
        </SettingsCard>
    );
}
