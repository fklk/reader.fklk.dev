import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { api } from "@/trpc/server";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

type NovelInsightCardProps = {
    id: string;
};

export default async function NovelInsightCard(props: NovelInsightCardProps) {
    const novel = await api.novel.getById.query({
        id: props.id,
        include: ["customInsights"],
    });

    if (!novel) {
        return;
    }

    const defaultInsightsState = await api.novel.getInsightState.query({
        novelId: props.id,
        category: "DEFAULT",
    });
    const customInsightsState = await api.novel.getInsightState.query({
        novelId: props.id,
        category: "CUSTOM",
    });

    return (
        <Link
            href={`/novel/${novel.id}/insights`}
            className="h-24 max-w-min min-w-96"
        >
            <Card className="h-full flex flex-row items-center">
                <div className="h-full w-24 rounded-bl-md overflow-hidden relative">
                    <Image
                        src={novel.imgPath}
                        alt="Cover image"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <CardHeader className="text-xl font-semibold pb-0">
                        {novel.name}
                    </CardHeader>
                    <CardContent className="flex items-center">
                        <div className="flex gap-3">
                            <div className="flex gap-1 items-center">
                                {defaultInsightsState?.isActive ? (
                                    <CheckCircle2Icon className="text-green-500 w-5 h-5" />
                                ) : (
                                    <XCircleIcon className="text-red-500 w-5 h-5" />
                                )}
                                <span
                                    className={`font-medium ${
                                        defaultInsightsState?.isActive
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    Default
                                </span>
                            </div>
                            <div className="flex gap-1 items-center">
                                {customInsightsState?.isActive ? (
                                    <CheckCircle2Icon className="text-green-500 w-5 h-5" />
                                ) : (
                                    <XCircleIcon className="text-red-500 w-5 h-5" />
                                )}
                                <span
                                    className={`font-medium ${
                                        customInsightsState?.isActive
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    Custom
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </Link>
    );
}
