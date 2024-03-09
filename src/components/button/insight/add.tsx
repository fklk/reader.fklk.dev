"use client";

import { Button } from "@/components/shadcn/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import React from "react";
import { Textarea } from "@/components/shadcn/textarea";
import { addNovelInsight } from "@/lib/actions";

type AddInsightButtonProps = {
    novelId: string;
};

export default function AddInsightButton(props: AddInsightButtonProps) {
    const handleAddInsight = addNovelInsight.bind(null, props.novelId);

    return (
        <Dialog modal={false}>
            <DialogTrigger asChild>
                <Button>Add Insight</Button>
            </DialogTrigger>
            <DialogContent>
                <form
                    action={handleAddInsight}
                    className="flex flex-col gap-3"
                >
                    <h3 className="text-xl font-medium">Create Insight</h3>
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
                            className="w-80 resize-none"
                        />
                    </div>
                    <DialogClose asChild>
                        <Button
                            type="submit"
                            className="w-fit mx-auto"
                        >
                            Create
                        </Button>
                    </DialogClose>
                </form>
            </DialogContent>
        </Dialog>
    );
}
