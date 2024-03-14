import { capitalize } from "@/lib/utils";
import { AlertTriangleIcon, InfoIcon, XCircleIcon } from "lucide-react";
import { ReactNode } from "react";

const types = ["INFO", "WARNING", "ERROR"] as const;

export type CalloutType = (typeof types)[number];

type CalloutProps = {
    type: CalloutType;
    children: ReactNode;
};

export default function Callout(props: CalloutProps) {
    return (
        <div
            className={
                getBorderColor(props.type) +
                " " +
                getBackgroundColor(props.type) +
                " flex flex-col gap-1 p-2 text-sm w-fit py-3 px-6 h-fit rounded-md border-2"
            }
        >
            <div className="flex gap-2 items-center font-semibold">
                {getIcon(props.type)}
                <h3 className={getPrimaryColor(props.type)}>
                    {capitalize(props.type.toString())}
                </h3>
            </div>
            {props.children}
        </div>
    );
}

const getIcon = (type: CalloutType) => {
    const iconClasses = "w-5 h-5";
    const iconColor = getPrimaryColor(type);

    switch (type) {
        case "INFO":
            return <InfoIcon className={iconClasses + " " + iconColor} />;
        case "WARNING":
            return (
                <AlertTriangleIcon className={iconClasses + " " + iconColor} />
            );
        case "ERROR":
            return <XCircleIcon className={iconClasses + " " + iconColor} />;
    }
};

const getPrimaryColor = (type: CalloutType) => {
    switch (type) {
        case "INFO":
            return "text-sky-400";
        case "WARNING":
            return "text-yellow-400";
        case "ERROR":
            return "text-red-400";
    }
};

const getBorderColor = (type: CalloutType) => {
    switch (type) {
        case "INFO":
            return "border-sky-400";
        case "WARNING":
            return "border-yellow-400";
        case "ERROR":
            return "border-red-400";
    }
};

const getBackgroundColor = (type: CalloutType) => {
    switch (type) {
        case "INFO":
            return "bg-sky-100";
        case "WARNING":
            return "bg-yellow-100";
        case "ERROR":
            return "bg-red-100";
    }
};
