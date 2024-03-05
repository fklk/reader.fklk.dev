"use client";

import SiteSettingModal from "@/components/modal/site-setting/modal";
import SettingsCard from "@/components/card/site-settings/settings-card";
import { columns } from "../../../config/tables/site-settings/showcase";
import { Genre, Novel, User } from "@prisma/client";

type SiteSettingsShowcaseCardProps = {
    novels: (Novel & { author: User; genre: Genre })[];
    saveAction: (ids: string[], formData: FormData) => Promise<void>;
};

export default function SiteSettingsShowcaseCard(
    props: SiteSettingsShowcaseCardProps
) {
    return (
        <SettingsCard title="Showcase">
            <SiteSettingModal
                tableColumns={columns}
                tableFilters={[
                    {
                        displayName: "name",
                        accessorName: "name",
                        renderAs: "TEXT_INPUT",
                    },
                    {
                        displayName: "author",
                        accessorName: "authorName",
                        renderAs: "SELECTOR",
                        items: Array.from(
                            new Set(
                                props.novels.map(novel => novel.author.handle)
                            )
                        ),
                    },
                    {
                        displayName: "status",
                        accessorName: "status",
                        renderAs: "SELECTOR",
                        items: Array.from(
                            new Set(props.novels.map(novel => novel.status))
                        ),
                    },
                    {
                        displayName: "genre",
                        accessorName: "genreName",
                        renderAs: "SELECTOR",
                        items: Array.from(
                            new Set(props.novels.map(novel => novel.genre.name))
                        ),
                    },
                ]}
                tableItems={props.novels.map(novel => ({
                    ...novel,
                    authorName: novel.author.handle,
                    genreName: novel.genre.name,
                }))}
                saveAction={props.saveAction}
            />
        </SettingsCard>
    );
}
