"use client";

import { Button } from "@/components/shadcn/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/shadcn/dialog";
import { api } from "@/trpc/react";
import { ZapIcon } from "lucide-react";

type EnableNovelInsightsModalProps = {
    novelId: string;
};

export default function EnableNovelInsightsModal(
    props: EnableNovelInsightsModalProps
) {
    const enableInsightsMutation = api.insight.enable.useMutation();

    const handleClick = () => {
        enableInsightsMutation.mutate({ novelId: props.novelId });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleClick}
                >
                    <ZapIcon className="w-5 h-5 box-content" />
                </Button>
            </DialogTrigger>
            <DialogContent className="px-10 py-8 max-w-lg">
                <h2 className="text-2xl font-semibold">Enable Insights</h2>
                <p>
                    With insights, you - as well as the author of the novel -
                    can add context to words. This allows authors to provide
                    more context when needed. You on the other hand can note
                    down information that you need for yourself (e.g. associate
                    names with characters, ...). <br />
                    Once enabled, insights can be managed under the
                    &apos;Insights&apos; tab in the navigation bar.
                </p>
                <DialogClose asChild>
                    <Button
                        className="w-full"
                        onClick={handleClick}
                    >
                        Enable
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
