"use client";

import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { Button } from "@/components/shadcn/button";
import { Form } from "@/components/form/form";
import { handleCreateChapter } from "@/lib/actions";
import { Novel } from "@prisma/client";
import { useRouter } from "next/navigation";
import { DialogClose } from "../shadcn/dialog";

type AddChapterFormProps = {
    novel: Novel;
    nextDescriptor: number;
};

export default function AddChapterForm(props: AddChapterFormProps) {
    const router = useRouter();

    const handleUpdate = (prevState: any, formData: FormData) => {
        const res = handleCreateChapter(prevState, formData);
        router.refresh();
        return res;
    };

    return (
        <Form
            action={handleUpdate}
            className="mt-8 flex flex-col gap-4 place-content-between min-w-[60rem]"
        >
            <input
                type="hidden"
                name="novelId"
                value={props.novel.id}
            />
            <h2 className="text-2xl font-semibold">
                Chapter {props.nextDescriptor}
            </h2>
            <div className="flex justify-between items-center">
                <Label
                    className="text-lg"
                    htmlFor="name"
                >
                    Name
                </Label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    className="w-[45rem]"
                />
            </div>
            <div className="flex justify-between items-center">
                <Label
                    className="text-lg place-self-start"
                    htmlFor="description"
                >
                    Content
                </Label>
                <Textarea
                    id="content"
                    name="content"
                    rows={15}
                    className="w-[45rem]"
                />
            </div>
            <DialogClose>
                <Button type="submit">Create</Button>
            </DialogClose>
        </Form>
    );
}
