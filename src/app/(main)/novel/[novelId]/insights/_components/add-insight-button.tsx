"use client";

import { Button } from "@/app/_components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import React from "react";
import { Textarea } from "@/app/_components/ui/textarea";
import { addNovelInsight } from "@/lib/actions";

type AddInsightButtonProps = {
    novelId: string;
};

export default function AddInsightButton(props: AddInsightButtonProps) {
    const handleAddInsight = addNovelInsight.bind(null, props.novelId);

    // TODO: "Enable Insights" button on novel page that adds the novel to the users 
    // insight states with active for both default and custom

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
                    <div className="flex justify-between items-center">
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
                    <div className="flex justify-between items-center">
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
