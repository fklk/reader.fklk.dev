"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "../../shadcn/card";
import { Dialog, DialogContent, DialogTrigger } from "../../shadcn/dialog";

type NovelEditCardProps = {
    title: string;
    children: ReactNode;
};

export default function NovelEditCard(props: NovelEditCardProps) {
    return (
        <Dialog>
            <DialogTrigger>
                <Card>
                    <CardContent className="text-2xl bg-secondary font-semibold flex items-center justify-center px-4 py-8">
                        {props.title}
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent>{props.children}</DialogContent>
        </Dialog>
    );
}
