"use client";

import SiteSettingModal from "@/components/modal/site-settings/modal";
import SettingsCard from "@/components/card/site-settings/settings-card";
import { CalloutType } from "@/components/base/callout";
import { Comment, Novel, User } from "@prisma/client";
import { columns } from "@/config/tables/site-settings/comment";

type SiteSettingsCommentCardProps = {
    comments: (Comment & { author: User; novel: Novel })[];
    callout?: {
        type: CalloutType;
        message: string;
    };
    deleteAction: (ids: string[], formData: FormData) => Promise<void>;
};

export default function SiteSettingsCommentCard(
    props: SiteSettingsCommentCardProps
) {
    return (
        <SettingsCard
            title="Comments"
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
                                props.comments.map(
                                    comment => comment.author.handle
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
                                props.comments.map(
                                    comment => comment.novel.name
                                )
                            )
                        ),
                    },
                ]}
                tableItems={props.comments.map(comment => ({
                    ...comment,
                    novelName: comment.novel.name,
                    authorName: comment.author.handle,
                }))}
                deleteAction={props.deleteAction}
            />
        </SettingsCard>
    );
}
