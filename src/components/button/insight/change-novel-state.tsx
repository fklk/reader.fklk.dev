"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/shadcn/popover";
import { api } from "@/trpc/react";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import React from "react";

type ChangeNovelInsightStateButtonProps = {
    novelId: string;
    category: "DEFAULT" | "CUSTOM";
};

export default function ChangeNovelInsightStateButton(
    props: ChangeNovelInsightStateButtonProps
) {
    const insightStateQuery = api.novel.getInsightState.useQuery({
        novelId: props.novelId,
        category: props.category,
    });
    const changeInsightStateMutation = api.novel.setInsightState.useMutation();

    // TODO:Implement instant reload, adjust design
    const handleStateChange = () => {
        changeInsightStateMutation.mutate({
            novelId: props.novelId,
            category: props.category,
            state: insightStateQuery.data?.isActive ? "inactive" : "active",
        });
        insightStateQuery.refetch();
    };

    return (
        <Popover>
            <PopoverTrigger>
                <div
                    className={`flex items-center gap-1 text-lg px-3 py-1 bg-secondary rounded-md ${
                        insightStateQuery.data?.isActive
                            ? "text-green-500"
                            : "text-red-500"
                    }`}
                >
                    <CheckCircle2Icon
                        className={`${
                            insightStateQuery.data?.isActive
                                ? "text-green-500"
                                : "text-red-500"
                        } w-4 h-4`}
                    />
                    {insightStateQuery.data?.isActive ? "Active" : "Inactive"}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-fit flex flex-col gap-1 py-1 px-2">
                <div
                    className={`flex items-center gap-1 text-lg ${
                        insightStateQuery.data?.isActive
                            ? "text-green-500"
                            : "text-red-500"
                    } py-1 px-3 cursor-pointer`}
                    onClick={() => handleStateChange()}
                >
                    {insightStateQuery.data?.isActive ? (
                        <CheckCircle2Icon className={`text-red-500 w-4 h-4`} />
                    ) : (
                        <XCircleIcon className={`text-green-500 w-4 h-4`} />
                    )}
                    <span
                        className={`text-md ${
                            insightStateQuery.data?.isActive
                                ? "text-red-500"
                                : "text-green-500"
                        }`}
                    >
                        {insightStateQuery.data?.isActive
                            ? "Inactive"
                            : "Active"}
                    </span>
                </div>
            </PopoverContent>
        </Popover>
    );
}
