import Callout, { CalloutType } from "@/components/base/callout";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/shadcn/dialog";
import { ReactNode } from "react";

type SettingsCardProps = {
    title: string;
    callout?: {
        type: CalloutType;
        message: string;
    };
    children: ReactNode;
};

export default function SettingsCard(props: SettingsCardProps) {
    return (
        <Dialog>
            <DialogTrigger>
                <Card className="min-w-48 justify-center max-w-48 min-h-32 bg-secondary cursor-pointer flex items-center">
                    <CardContent className="p-0">
                        <h2 className="text-2xl font-bold max-w-48">
                            {props.title}
                        </h2>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="h-5/6 max-h-5/6 w-3/4 overflow-y-scroll flex flex-col gap-4">
                <h2 className="text-3xl font-bold">{props.title}</h2>
                {props.callout && (
                    <Callout type={props.callout.type}>
                        {props.callout.message}
                    </Callout>
                )}
                {props.children}
            </DialogContent>
        </Dialog>
    );
}
