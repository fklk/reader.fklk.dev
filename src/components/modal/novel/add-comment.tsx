"use client";

import { MessageSquareMoreIcon } from "lucide-react";
import { Button } from "../../shadcn/button";
import { Dialog, DialogContent, DialogTrigger } from "../../shadcn/dialog";
import AddCommentForm from "../../form/add-comment";
import { Comment, User } from "@prisma/client";
import CommentCard from "@/components/card/novel/comment";

type AddCommentModalProps = {
    novelId: string;
    comments: (Comment & { author: User })[];
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
            <DialogContent className="flex w-[55rem] justify-evenly max-h-[30rem]">
                <AddCommentForm novelId={props.novelId} />
                <div className="w-80 flex flex-col gap-2 overflow-y-scroll">
                    {props.comments.map(comment => (
                        <CommentCard
                            key={comment.id}
                            comment={comment}
                        />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
