"use client";

import SiteSettingModal from "@/components/modal/site-setting/modal";
import SettingsCard from "@/components/card/site-settings/settings-card";
import { CalloutType } from "@/app/_components/callout";
import { Genre } from "@prisma/client";
import { columns } from "@/config/tables/site-settings/genre";

type SiteSettingsGenreCardProps = {
    genres: Genre[];
    callout?: {
        type: CalloutType;
        message: string;
    };
    createAction: (ids: string[], formData: FormData) => Promise<void>;
};

export default function SiteSettingsGenreCard(
    props: SiteSettingsGenreCardProps
) {
    return (
        <SettingsCard
            title="Genres"
            callout={props.callout}
        >
            <SiteSettingModal
                tableColumns={columns}
                tableFilters={[
                    {
                        displayName: "name",
                        accessorName: "name",
                        renderAs: "TEXT_INPUT",
                    },
                ]}
                tableItems={props.genres}
                createAction={props.createAction}
            />
        </SettingsCard>
    );
}
