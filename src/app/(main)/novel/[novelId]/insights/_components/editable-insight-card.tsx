"use client";

import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import { deleteCustomInsight, updateCustomInsight } from "@/lib/actions";
import { CustomNovelInsight, NovelInsight } from "@prisma/client";
import { Trash2Icon } from "lucide-react";

type EditableInsightCardProps = {
    insight: NovelInsight | CustomNovelInsight;
};

export default function EditableInsightCard(props: EditableInsightCardProps) {
    const handleUpdateInsight = updateCustomInsight.bind(
        null,
        props.insight.novelId,
        props.insight.trigger
    );

    const handleDeleteInsight = deleteCustomInsight.bind(
        null,
        props.insight.novelId,
        props.insight.trigger
    );

    return (
        <Dialog modal={false}>
            <DialogTrigger>
                <Card className="max-w-md w-60">
                    <CardHeader className="bg-secondary py-3">
                        <h3 className="flex justify-between items-center">
                            <div className="flex gap-1">
                                Trigger:
                                <span className="font-bold">
                                    {props.insight.trigger}
                                </span>
                            </div>
                        </h3>
                    </CardHeader>
                    <CardContent className="flex items-center text-left py-3">
                        <p>{props.insight.content}</p>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent>
                <form className="flex flex-col gap-3">
                    <h3 className="text-xl font-medium">Edit Insight</h3>
                    <div className="flex justify-between gap-4 items-center">
                        <Label
                            className="text-md"
                            htmlFor="trigger"
                        >
                            Trigger
                        </Label>
                        <Input
                            type="text"
                            name="trigger"
                            id="trigger"
                            defaultValue={props.insight.trigger}
                            className="w-80"
                        />
                    </div>
                    <div className="flex justify-between gap-4 items-center">
                        <Label
                            className="text-md"
                            htmlFor="content"
                        >
                            Content
                        </Label>
                        <Textarea
                            name="content"
                            id="content"
                            defaultValue={props.insight.content}
                            className="w-80 resize-none"
                        />
                    </div>
                    <DialogClose
                        className="w-full p-0"
                        asChild
                    >
                        <div className="flex justify-between w-full">
                            <Button
                                type="submit"
                                size="icon"
                                variant="destructive"
                                formAction={handleDeleteInsight}
                            >
                                <Trash2Icon className="w-5 h-5" />
                            </Button>
                            <Button
                                type="submit"
                                formAction={handleUpdateInsight}
                                className="w-fit"
                            >
                                Update
                            </Button>
                        </div>
                    </DialogClose>
                </form>
            </DialogContent>
        </Dialog>
    );
}
