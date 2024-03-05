import Callout, { CalloutType } from "@/app/_components/callout";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/app/_components/ui/dialog";
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
        <Dialog modal={false}>
            <DialogTrigger>
                <Card className="min-w-48 justify-center max-w-48 min-h-32 bg-secondary cursor-pointer flex items-center">
                    <CardContent className="p-0">
                        <h2 className="text-2xl font-bold max-w-48">
                            {props.title}
                        </h2>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="h-5/6 max-h-5/6 w-3/4 overflow-y-scroll">
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
