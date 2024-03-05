"use client";

import SiteSettingModal from "@/components/modal/site-setting/modal";
import SettingsCard from "@/components/card/site-settings/settings-card";
import { CalloutType } from "@/app/_components/callout";
import { columns } from "@/config/tables/site-settings/user";
import { User } from "@prisma/client";

type SiteSettingsUserCardProps = {
    users: User[];
    callout?: {
        type: CalloutType;
        message: string;
    };
    saveAction: (ids: string[], formData: FormData) => Promise<void>;
    deleteAction: (ids: string[], formData: FormData) => Promise<void>;
};

export default function SiteSettingsUserCard(props: SiteSettingsUserCardProps) {
    return (
        <SettingsCard
            title="Users"
            callout={props.callout}
        >
            <SiteSettingModal
                tableColumns={columns}
                tableFilters={[
                    {
                        displayName: "handle",
                        accessorName: "handle",
                        renderAs: "TEXT_INPUT",
                    },
                    {
                        displayName: "email",
                        accessorName: "email",
                        renderAs: "TEXT_INPUT",
                    },
                    {
                        displayName: "role",
                        accessorName: "role",
                        renderAs: "SELECTOR",
                        items: Array.from(
                            new Set(props.users.map(user => user.role))
                        ),
                    },
                ]}
                tableItems={props.users}
                saveAction={props.saveAction}
                deleteAction={props.deleteAction}
            />
        </SettingsCard>
    );
}
