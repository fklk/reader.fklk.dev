"use client";

import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import Selector from "../../browse/_components/selector";
import { Form } from "@/app/_components/form";
import { handleCreateNovel } from "@/lib/actions";
import { useState } from "react";

type CreateNovelFormProps = {
    genreNames: string[];
};

export default function CreateNovelForm(props: CreateNovelFormProps) {
    const [genre, setGenre] = useState<string>(null!);

    return (
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
            <div className="flex items-center gap-2">
                Chapters can later be added under{" "}
                <Badge variant="secondary">My Novels</Badge>
            </div>
            <Button type="submit">Create</Button>
        </Form>
    );
}
