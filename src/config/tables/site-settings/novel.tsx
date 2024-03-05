"use client";

import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Novel } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon } from "lucide-react";

export const columns: ColumnDef<Novel>[] = [
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
    {
        accessorKey: "description",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    description
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <Textarea
                    name={`description_${row.getValue("id")}`}
                    defaultValue={row.getValue("description")}
                />
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    status
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <Badge variant="secondary">{row.getValue("status")}</Badge>;
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
                <span className="text-center">
                    {row.getValue("authorName")}
                </span>
            );
        },
    },
    {
        accessorKey: "genreName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    genre
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <Badge>{row.getValue("genreName")}</Badge>;
        },
    },
    {
        accessorKey: "views",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    views
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
];
