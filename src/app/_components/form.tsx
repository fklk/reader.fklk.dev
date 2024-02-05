"use client";

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
            <p>{state.error}</p>
            {children}
        </form>
    );
}

export interface ActionResult {
    error: string | null;
}
