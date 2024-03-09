"use client";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/shadcn/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/shadcn/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type NovelSelectorProps = {
    novels: {
        id: string;
        name: string;
    }[];
};

export default function NovelSelector(props: NovelSelectorProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value ? (
                        <div className="flex items-center gap-2">
                            Novel:{" "}
                            <Badge className="font-semibold">
                                {
                                    props.novels.find(
                                        novel =>
                                            novel.name.toLowerCase() === value
                                    )?.name
                                }
                            </Badge>
                        </div>
                    ) : (
                        `Select novel...`
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search novel..." />
                    <CommandEmpty>No novel found.</CommandEmpty>
                    <CommandGroup>
                        {props.novels.map(novel => (
                            <CommandItem
                                key={novel.id}
                                value={novel.name}
                                onSelect={currentValue => {
                                    setValue(
                                        currentValue === value
                                            ? ""
                                            : currentValue
                                    );
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === novel.name.toLowerCase()
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {novel.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
