import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/shadcn/avatar";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { formatDuration } from "@/lib/utils";
import { Comment, User } from "@prisma/client";

type CommentCardProps = {
    comment: Comment & { author: User };
};

export default function CommentCard({ comment }: CommentCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex gap-2 items-center">
                    <Avatar>
                        <AvatarFallback>
                            {comment.author.handle.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{comment.author.handle}</p>
                </div>
                <div className="flex items-center">
                    <p className="text-muted-foreground">
                        {formatDuration(comment.createdAt)}
                    </p>
                </div>
            </CardHeader>
            <CardContent>{comment.content}</CardContent>
        </Card>
    );
}
