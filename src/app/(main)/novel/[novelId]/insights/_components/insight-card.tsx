import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { CustomNovelInsight, NovelInsight } from "@prisma/client";

type InsightCardProps = {
    insight: NovelInsight | CustomNovelInsight;
};

export default async function InsightCard(props: InsightCardProps) {
    return (
        <Card className="max-w-md w-60">
            <CardHeader className="bg-slate-200 py-3">
                <h3 className="flex justify-between items-center">
                    <div className="flex gap-1">
                        Trigger:
                        <span className="font-bold">
                            {props.insight.trigger}
                        </span>
                    </div>
                </h3>
            </CardHeader>
            <CardContent className="flex items-center py-3">
                <p>{props.insight.content}</p>
            </CardContent>
        </Card>
    );
}
