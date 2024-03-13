"use client";

import { useRouter } from "next/navigation";
import { Button } from "../shadcn/button";
import { DialogClose } from "../shadcn/dialog";
import { Input } from "../shadcn/input";
import { Label } from "../shadcn/label";
import { Textarea } from "../shadcn/textarea";
import { Form } from "./form";
import { handleInsightCreate } from "@/lib/actions";
import Selector from "../selector/selector";
import { Chapter } from "@prisma/client";
import { useState } from "react";

type AddInsightFormProps = {
    novelId: string;
    chapters: Chapter[];
};

export default function AddInsightForm(props: AddInsightFormProps) {
    const router = useRouter();

    const [chapterId, setChapterId] = useState<string>(
        props.chapters.at(0)!.id
    );

    const handleCreate = (prevState: any, formData: FormData) => {
        const res = handleInsightCreate(prevState, formData);
        router.refresh();
        return res;
    };

    return (
        <Form
            action={handleCreate}
            className="flex flex-col gap-3"
        >
            <input
                type="hidden"
                name="novelId"
                value={props.novelId}
            />
            <input
                type="hidden"
                name="chapterId"
                value={chapterId}
            />
            <h3 className="text-xl font-medium">Add Insight</h3>
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
            <div className="flex justify-between gap-4 items-center">
                <Label
                    className="text-md"
                    htmlFor="content"
                >
                    Starts at
                </Label>
                <Selector
                    name="chapter"
                    errorMessage="No chapter found"
                    items={props.chapters.map(chapter => chapter.id)}
                    render={props.chapters.map(chapter => chapter.name)}
                    defaultValue={props.chapters.at(0)!.id}
                    onSelect={setChapterId}
                />
            </div>
            <DialogClose
                className="w-full p-0"
                asChild
            >
                <Button type="submit">Add</Button>
            </DialogClose>
        </Form>
    );
}
