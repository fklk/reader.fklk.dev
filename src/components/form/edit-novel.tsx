"use client";

import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Form } from "@/components/form/form";
import { handleUpdateNovel } from "@/lib/actions";
import { useState } from "react";
import Selector from "@/components/selector/selector";
import { Genre, Novel } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

type CreateNovelFormProps = {
    novel: Novel;
    genres: Genre[];
};

export default function EditNovelForm(props: CreateNovelFormProps) {
    const [genre, setGenre] = useState<string>(
        props.genres.find(genre => genre.id === props.novel.genreId)!.name
    );

    const router = useRouter();

    const handleUpdate = (prevState: any, formData: FormData) => {
        const res = handleUpdateNovel(prevState, formData);
        router.refresh();
        return res;
    };

    return (
        <div className="flex justify-between">
            <Form
                action={handleUpdate}
                className="mt-8 flex flex-col gap-4 place-content-between w-1/3"
            >
                <input
                    type="hidden"
                    name="novelId"
                    value={props.novel.id}
                />
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
                        defaultValue={props.novel.name}
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
                        items={props.genres.map(genre => genre.name)}
                        name="genre"
                        errorMessage="No genre found."
                        defaultValue={genre}
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
                        defaultValue={props.novel.description}
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
                <Button type="submit">Update</Button>
            </Form>
            <div className="w-1/2 h-full">
                <Image
                    src={props.novel.imgPath}
                    width={500}
                    height={300}
                    alt="Cover image"
                />
            </div>
        </div>
    );
}