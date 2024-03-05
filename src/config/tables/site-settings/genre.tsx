"use client";

import { Button } from "@/app/_components/ui/button";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Input } from "@/app/_components/ui/input";
import { Genre } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon } from "lucide-react";

export const columns: ColumnDef<Genre>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={value =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: "id",
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    name
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <Input
                    type="text"
                    className="w-fit"
                    name={`name_${row.getValue("id")}`}
                    defaultValue={row.getValue("name")}
                />
            );
        },
    },
];
