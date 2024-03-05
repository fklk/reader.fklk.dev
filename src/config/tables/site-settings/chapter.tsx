"use client";

import { Button } from "@/app/_components/ui/button";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Textarea } from "@/app/_components/ui/textarea";
import { Chapter } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon } from "lucide-react";

export const columns: ColumnDef<Chapter>[] = [
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
        accessorKey: "descriptor",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    descriptor
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <span className="text-left">{row.getValue("descriptor")}</span>
            );
        },
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
            return <span className="text-left">{row.getValue("name")}</span>;
        },
    },
    {
        accessorKey: "authorName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    author
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <span className="text-left">{row.getValue("authorName")}</span>
            );
        },
    },
    {
        accessorKey: "novelName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    novel
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <span className="text-left">{row.getValue("novelName")}</span>
            );
        },
    },
];
