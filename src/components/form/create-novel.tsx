"use client";

import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import Selector from "../selector/selector";
import { Form } from "@/components/form/form";
import { handleCreateNovel } from "@/lib/actions";
import { useState } from "react";

type CreateNovelFormProps = {
    genreNames: string[];
};

export default function CreateNovelForm(props: CreateNovelFormProps) {
    const [genre, setGenre] = useState<string>("");

    return (
        <div className="flex justify-between">
            <Form
                action={handleCreateNovel}
                className="mt-8 flex flex-col gap-4 place-content-between w-1/3"
            >
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
                        className="w-80"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <Label
                        className="text-lg"
                        htmlFor="genre"
                    >
                        Genre
                    </Label>
                    <Selector
                        items={props.genreNames}
                        name="genre"
                        errorMessage="No genre found."
                        defaultValue=""
                        onSelect={setGenre}
                    />
                    <input
                        type="hidden"
                        name="genre"
                        value={genre}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <Label
                        className="text-lg place-self-start"
                        htmlFor="description"
                    >
                        Description
                    </Label>
                    <Textarea
                        id="description"
                        name="description"
                        className="w-80"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <Label
                        className="text-lg place-self-start"
                        htmlFor="description"
                    >
                        Cover
                    </Label>
                    <Input
                        type="file"
                        name="cover"
                        className="w-80"
                    />
                </div>
                <div className="flex items-center gap-2">
                    Chapters can later be added under{" "}
                    <Badge variant="secondary">My Novels</Badge>
                </div>
                <Button type="submit">Create</Button>
            </Form>
        </div>
    );
}
