"use client";

// Source: https://ui.shadcn.com/docs/components/data-table
// General layout adopted, adjusted to meet requirements

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shadcn/table";
import { useEffect, useState } from "react";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { SaveIcon, Trash2Icon } from "lucide-react";
import { DialogClose } from "@/components/shadcn/dialog";
import { toast } from "sonner";
import { z } from "zod";
import Selector from "@/components/selector/selector";

const SearchInputSchema = z
    .object({
        displayName: z.string().min(1),
        accessorName: z.string().min(1),
        renderAs: z.enum(["TEXT_INPUT", "SELECTOR"]),
        items: z.array(z.string()).optional(),
    })
    .refine(
        ({ renderAs, items }) => {
            return (renderAs === "SELECTOR") === !!items;
        },
        {
            message:
                "Items must be provided if input is rendered as 'SELECTOR'",
        }
    );

export type SearchInput = z.infer<typeof SearchInputSchema>;

type SiteSettingsTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    setSelection: (selection: string[]) => void;
    searchInputs?: SearchInput[];
    createAction?: (formData: FormData) => void;
    saveAction?: (formData: FormData) => void;
    deleteAction?: (formData: FormData) => void;
};

export function SiteSettingsTable<TData, TValue>({
    columns,
    data,
    setSelection,
    searchInputs,
    createAction,
    saveAction,
    deleteAction,
}: SiteSettingsTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const parsedSearchInputs = SearchInputSchema.array().parse(searchInputs);

    useEffect(() => {
        const selectedRows = table.getFilteredSelectedRowModel();
        const selectedIds = selectedRows.rows.map(
            row => row.getValue("id") as string
        );
        setSelection(selectedIds);
    }, [rowSelection]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            rowSelection,
            columnFilters,
        },
    });

    return (
        <>
            <div className="flex items-center pb-4 justify-between">
                <div className="flex items-center gap-3">
                    {parsedSearchInputs.map(si =>
                        si.renderAs === "TEXT_INPUT" ? (
                            <Input
                                key={si.accessorName}
                                placeholder={`Filter by ${si.displayName}`}
                                value={
                                    (table
                                        .getColumn(si.accessorName)
                                        ?.getFilterValue() as string) ?? ""
                                }
                                onChange={event =>
                                    table
                                        .getColumn(si.accessorName)
                                        ?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        ) : (
                            <Selector
                                key={si.accessorName}
                                name={si.displayName}
                                items={si.items!}
                                errorMessage={`No ${si.displayName} found`}
                                defaultValue=""
                                onSelect={value =>
                                    table
                                        .getColumn(si.accessorName)
                                        ?.setFilterValue(value)
                                }
                            />
                        )
                    )}
                </div>
                <div className="flex gap-3 items-center">
                    <DialogClose asChild>
                        <div className="flex gap-3 items-center">
                            {saveAction && (
                                <Button
                                    size="icon"
                                    type="submit"
                                    formAction={saveAction}
                                    onClick={() =>
                                        toast("Successfully updated items.")
                                    }
                                >
                                    <SaveIcon />
                                </Button>
                            )}
                            {deleteAction && (
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    type="submit"
                                    formAction={deleteAction}
                                    onClick={() =>
                                        toast("Successfully deleted items.")
                                    }
                                >
                                    <Trash2Icon />
                                </Button>
                            )}
                        </div>
                    </DialogClose>
                    {createAction && (
                        <>
                            <Input
                                name="name"
                                type="text"
                            />
                            <Button
                                type="submit"
                                formAction={createAction}
                            >
                                Create
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
