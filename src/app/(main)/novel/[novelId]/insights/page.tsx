import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { Separator } from "@/components/shadcn/separator";
import AddInsightButton from "@/components/button/insight/add";
import ChangeNovelInsightStateButton from "@/components/button/insight/change-novel-state";
import InsightCard from "@/components/card/insight/insight";
import EditableInsightCard from "@/components/card/insight/editable";

type InsightNovelPageProps = {
    params: {
        novelId: string;
    };
};

export default async function InsightNovelPage(props: InsightNovelPageProps) {
    const novel = await api.novel.getById.query({ id: props.params.novelId });

    if (!novel) {
        notFound();
    }

    const insights = await api.novel.getInsights.query({
        id: props.params.novelId,
    });

    const customInsights = await api.novel.getCustomInsights.query({
        id: props.params.novelId,
    });

    return (
        <div className="mt-8 flex flex-col gap-4">
            <div className="flex gap-6 items-center">
                <h1 className="text-3xl font-bold">Insights: {novel.name}</h1>
                <AddInsightButton novelId={props.params.novelId} />
            </div>
            <div className="flex flex-col gap-8 mt-4">
                <div className="flex flex-col gap-2">
                    <div className="mb-2 flex gap-4 items-center">
                        <h2 className="text-2xl font-semibold">By author</h2>
                        <ChangeNovelInsightStateButton
                            novelId={props.params.novelId}
                            category="DEFAULT"
                        />
                    </div>
                    <div className="flex gap-8 flex-wrap">
                        {insights.map(insight => (
                            <InsightCard
                                key={`${insight.novelId}-${insight.trigger}-${insight.chapterId}`}
                                insight={insight}
                            />
                        ))}
                    </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                    <div className="mb-2 flex gap-4 items-center">
                        <h2 className="text-2xl font-semibold">By me</h2>
                        <ChangeNovelInsightStateButton
                            novelId={props.params.novelId}
                            category="CUSTOM"
                        />
                    </div>
                    <div className="flex gap-8 flex-wrap">
                        {customInsights.map(insight => (
                            <EditableInsightCard
                                key={`${insight.novelId}-${insight.trigger}-${insight.userId}`}
                                insight={insight}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
