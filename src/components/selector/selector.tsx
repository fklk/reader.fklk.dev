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
import { capitalize, cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type SelectorProps = {
    items: any[];
    name: string;
    errorMessage: string;
    defaultValue: string;
    render?: string[];
    urlParam?: string;
    onSelect?: (_: string) => void;
};

export default function Selector(props: SelectorProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>(props.defaultValue);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());

            if (params.has(name)) {
                params.delete(name);
            }
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    const handleSelectChange = (currentValue: string) => {
        setValue(currentValue === value ? "" : currentValue);
        setOpen(false);

        if (props.onSelect) {
            props.onSelect(currentValue === value ? "" : currentValue);
        }

        if (props.urlParam) {
            router.push(
                pathname + "?" + createQueryString(props.urlParam, currentValue)
            );
        }
    };

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    name={props.name}
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between bg-secondary focus-visible:bg-background"
                >
                    {value ? (
                        <div className="flex items-center gap-2">
                            {capitalize(props.name)}:{" "}
                            <Badge className="font-semibold">
                                {props.render
                                    ? props.render.at(
                                          props.items
                                              .map(item => item.toLowerCase())
                                              .indexOf(value.toLowerCase())
                                      )
                                    : props.items.find(
                                          item =>
                                              item.toLowerCase() ===
                                              value.toLowerCase()
                                      )}
                            </Badge>
                        </div>
                    ) : (
                        `Select ${props.name} ...`
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={`Search ${props.name}...`} />
                    <CommandEmpty>{props.errorMessage}</CommandEmpty>
                    <CommandGroup>
                        {props.items?.map(item => (
                            <CommandItem
                                key={item}
                                value={item}
                                onSelect={currentValue => {
                                    handleSelectChange(currentValue);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === item.toLowerCase()
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {props.render
                                    ? props.render.at(props.items.indexOf(item))
                                    : item}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
