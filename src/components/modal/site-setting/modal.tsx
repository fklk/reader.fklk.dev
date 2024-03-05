"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
    SearchInput,
    SiteSettingsTable,
} from "@/components/table/site-settings/table";

type SiteSettingModalProps = {
    tableItems: any[];
    tableColumns: ColumnDef<any>[];
    tableFilters?: SearchInput[];
    createAction?: (ids: string[], formData: FormData) => Promise<void>;
    saveAction?: (ids: string[], formData: FormData) => Promise<void>;
    deleteAction?: (ids: string[], formData: FormData) => Promise<void>;
};

export default function SiteSettingModal(props: SiteSettingModalProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleCreateWithId = props.createAction?.bind(null, selectedIds);
    const handleDeleteWithId = props.deleteAction?.bind(null, selectedIds);
    const handleSaveWithId = props.saveAction?.bind(null, selectedIds);

    return (
        <form className="flex flex-col gap-1">
            <div className="py-4">
                <SiteSettingsTable
                    columns={props.tableColumns}
                    data={props.tableItems}
                    searchInputs={props.tableFilters}
                    setSelection={setSelectedIds}
                    createAction={handleCreateWithId}
                    saveAction={handleSaveWithId}
                    deleteAction={handleDeleteWithId}
                />
            </div>
        </form>
    );
}
