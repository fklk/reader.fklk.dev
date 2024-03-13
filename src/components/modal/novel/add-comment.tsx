"use client";

import { MessageSquareMoreIcon } from "lucide-react";
import { Button } from "../../shadcn/button";
import { Dialog, DialogContent, DialogTrigger } from "../../shadcn/dialog";
import AddCommentForm from "../../form/add-comment";

type AddCommentModalProps = {
    novelId: string;
};

export default function AddCommentModal(props: AddCommentModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    variant="secondary"
                >
                    <MessageSquareMoreIcon className="w-5 h-5 box-content" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <AddCommentForm novelId={props.novelId} />
            </DialogContent>
        </Dialog>
    );
}
