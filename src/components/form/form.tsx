"use client";

import { XCircleIcon } from "lucide-react";
import { useFormState } from "react-dom";

export function Form({
    children,
    action,
    className,
}: {
    children: React.ReactNode;
    action: (prevState: any, formData: FormData) => Promise<ActionResult>;
    className?: string;
}) {
    const [state, formAction] = useFormState(action, {
        error: null,
    });
    return (
        <form
            action={formAction}
            className={className}
        >
            {state.error ? (
                <div className="py-2 px-4 w-full rounded-md justify-center gap-1 flex flex-col place-self-center bg-destructive/20 border border-destructive">
                    <div className="flex gap-2 items-center">
                        <XCircleIcon className="justify-self-start w-5 h-5 text-destructive" />
                        <h2 className="font-bold text-destructive">Error</h2>
                    </div>
                    {state.error}
                </div>
            ) : null}
            {children}
        </form>
    );
}

export interface ActionResult {
    error: string | null;
}
