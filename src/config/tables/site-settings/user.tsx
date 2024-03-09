"use client";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Input } from "@/components/shadcn/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon } from "lucide-react";

export type UserColumnDef = {
    id: string;
    email: string;
    handle: string;
    role: "USER" | "ADMIN";
};

export const columns: ColumnDef<UserColumnDef>[] = [
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
        accessorKey: "handle",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    handle
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <Input
                    type="text"
                    className="w-fit"
                    name={`handle_${row.getValue("id")}`}
                    defaultValue={row.getValue("handle")}
                />
            );
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    email
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <Input
                    type="text"
                    className="w-fit"
                    name={`email_${row.getValue("id")}`}
                    defaultValue={row.getValue("email")}
                />
            );
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    role
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <Select
                    name={`role_${row.getValue("id")}`}
                    defaultValue={row.getValue("role")}
                >
                    <SelectTrigger>
                        <SelectValue
                            placeholder={<Badge>{row.getValue("role")}</Badge>}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {["USER", "ADMIN"].map(name => (
                            <SelectItem
                                key={name}
                                value={name}
                            >
                                <Badge>{name}</Badge>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        },
    },
];
