import { api } from "@/trpc/server";
import NovelInsightCard from "../../../components/card/insight/novel";

export default async function InsightsPage() {
    const insights = await api.user.getInsightNovels.query();

    return (
        <div className="flex flex-col gap-8 pb-8 mt-4 flex-grow">
            <h1 className="text-3xl font-bold">Insights</h1>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-4 w-full">
                {insights.map(insight => (
                    <NovelInsightCard
                        key={insight.novelId}
                        id={insight.novelId}
                    />
                ))}
                {insights.length === 0 ? (
                    <div className="flex text-center flex-col items-center w-full gap-1">
                        <h4 className="text-xl">
                            No Insights are currently enabled
                        </h4>
                        <span>
                            Enable them on the respective novel&apos;s page
                        </span>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
