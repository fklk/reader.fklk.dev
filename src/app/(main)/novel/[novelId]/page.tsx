"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/app/_components/ui/avatar";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/app/_components/ui/hover-card";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { Textarea } from "@/app/_components/ui/textarea";
import { createCommentOnNovel } from "@/lib/actions";
import { formatDuration } from "@/lib/utils";
import { api } from "@/trpc/react";
import { TabsContent } from "@radix-ui/react-tabs";
import {
    CheckIcon,
    EditIcon,
    MessageSquareTextIcon,
    PlusIcon,
    Share2Icon,
    ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRef, useState } from "react";
import { capitalize } from "../../../../lib/utils";
import { getBaseUrl } from "@/trpc/shared";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/app/_components/ui/dialog";

type NovelPageProps = {
    params: {
        novelId: string;
    };
};

export default function NovelPage(props: NovelPageProps) {
    const [showComment, setShowComment] = useState(false);
    const addCommentRef = useRef<HTMLTextAreaElement>(null);

    // TODO: Add-Comment should be a modal
    // TODO: Make view count more realistic --> Counts only once per user?
    // TODO: Fix: runs infinity if just mutation without any conditions or on any event
    // --> Run increment on server component --> no relaod --> no infinite loop
    // --> New table to insert for each user only once --> count(*) for view-count
    // --> check if user already has an entry for respective novel before incrementing
    const incrementViewMutation = api.novel.incrementView.useMutation();

    const { data, isLoading } = api.novel.getById.useQuery({
        id: props.params.novelId,
        include: ["author", "chapters", "genre"],
    });

    const userQuery = api.session.getUser.useQuery();

    const comments = api.comment.getForNovel.useQuery({
        novelId: props.params.novelId,
    });

    const isNovelOnListResult = api.user.isNovelOnList.useQuery({
        novelId: props.params.novelId,
    });

    const createCommentOnNovelWithId = createCommentOnNovel.bind(
        null,
        data?.id ?? ""
    );

    const addNovelToListMutation = api.user.addNovelToList.useMutation({
        onSuccess: () => {
            isNovelOnListResult.refetch();
        },
    });
    const removeNovelFromListMutation =
        api.user.removeNovelFromList.useMutation({
            onSuccess: () => {
                isNovelOnListResult.refetch();
            },
        });

    const handleListAction = () => {
        const novelId = props.params.novelId;
        let mutation = isNovelOnListResult.data
            ? removeNovelFromListMutation
            : addNovelToListMutation;
        mutation.mutate({ novelId: novelId });
    };

    const enableInsightsMutation = api.insight.enable.useMutation();

    const handleEnableInsights = () => {
        enableInsightsMutation.mutate({ novelId: props.params.novelId });
    };

    // TODO: Add "settings" button only visible for the author --> redirect to /.../edit,
    // - for description, update notices and insights
    return (
        <div className="flex justify-between w-full flex-grow mt-4">
            <div className="flex gap-8">
                <div className="flex flex-col">
                    <div className="relative h-96 w-52 min-w-52">
                        {isLoading ? (
                            <Skeleton className="w-48 h-80" />
                        ) : (
                            <Image
                                src={data?.imgPath!}
                                alt="Novel cover"
                                fill
                                className="grayscale object-cover filter hover:filter-none rounded-lg"
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-1 justify-center mt-4 rounded-md p-4 bg-secondary">
                        <div className="grid-cols-2 grid">
                            <div className="font-semibold text-left">Name:</div>
                            <div>{data?.name}</div>
                        </div>
                        <div className="grid-cols-2 grid">
                            <div className="font-semibold text-left">
                                Author:
                            </div>
                            <div>{data?.author.handle}</div>
                        </div>
                        <div className="grid-cols-2 grid">
                            <div className="font-semibold text-left">
                                Chapters:
                            </div>
                            <div>{data?.chapters.length}</div>
                        </div>
                        <div className="grid-cols-2 grid">
                            <div className="font-semibold text-left">
                                Status:
                            </div>
                            <div>{capitalize(data?.status ?? "")}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-min">
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <div className="flex gap-4 items-center">
                                {isLoading ? (
                                    <Skeleton className="h-12 w-72" />
                                ) : (
                                    <h1 className="text-4xl font-extrabold">
                                        {data?.name}
                                    </h1>
                                )}
                                {isLoading ? null : (
                                    <Badge className="h-fit">
                                        {data?.genre.name}
                                    </Badge>
                                )}
                            </div>
                            <div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleListAction()}
                                >
                                    {isNovelOnListResult.data ? (
                                        <CheckIcon className="w-5 h-5" />
                                    ) : (
                                        <PlusIcon className="w-5 h-5" />
                                    )}
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                >
                                    {/* TODO: Modal that allows enabling insights */}
                                    <Dialog modal={false}>
                                        <DialogTrigger asChild>
                                            <ZapIcon className="w-5 h-5" />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <h3 className="text-2xl font-semibold">
                                                Enable Insights
                                            </h3>
                                            <p>
                                                Click the button below to enable
                                                Insights for this novel. You can
                                                then manage them under the
                                                Insights menu tab.
                                            </p>
                                            <DialogClose asChild>
                                                <Button
                                                    onClick={() =>
                                                        handleEnableInsights()
                                                    }
                                                >
                                                    Enable Insights
                                                </Button>
                                            </DialogClose>
                                        </DialogContent>
                                    </Dialog>
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={showComment ? "bg-accent" : ""}
                                    onClick={() => {
                                        setShowComment(!showComment);
                                        if (!showComment) {
                                            setTimeout(() => {
                                                addCommentRef.current?.focus();
                                            }, 100);
                                        }
                                    }}
                                >
                                    <MessageSquareTextIcon className="w-5 h-5" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            `${getBaseUrl()}/novel/${
                                                props.params.novelId
                                            }`
                                        )
                                    }
                                >
                                    <Share2Icon className="w-5 h-5" />
                                </Button>
                                {userQuery.data?.id === data?.author.id ? (
                                    <Link
                                        href={`/novel/${props.params.novelId}/edit`}
                                    >
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <EditIcon className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                        {isLoading ? (
                            <Skeleton className="h-4 w-28 mt-2" />
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                written by{" "}
                                <HoverCard>
                                    <HoverCardTrigger>
                                        {data?.author.handle}
                                    </HoverCardTrigger>
                                    <HoverCardContent>content</HoverCardContent>
                                </HoverCard>
                            </p>
                        )}
                    </div>
                    {
                        <div className="flex flex-col gap-2 min-w-[36rem] mt-4">
                            {isLoading ? (
                                <>
                                    <Skeleton className="h-4 w-96" />
                                    <Skeleton className="h-4 w-80" />
                                    <Skeleton className="h-4 w-72" />
                                    <Skeleton className="h-4 w-80" />
                                    <Skeleton className="h-4 w-80" />
                                    <Skeleton className="h-4 w-96" />
                                    <Skeleton className="h-4 w-72" />
                                </>
                            ) : (
                                data?.description
                            )}
                        </div>
                    }
                    {showComment ? (
                        <form
                            action={createCommentOnNovelWithId}
                            className="mt-6 flex flex-col gap-2"
                            onSubmit={() => setShowComment(false)}
                        >
                            <Textarea
                                ref={addCommentRef}
                                className="resize-none"
                                name="content"
                            />
                            <div className="place-self-end flex gap-4">
                                <Button
                                    variant="ghost"
                                    className="w-fit"
                                    onClick={() => setShowComment(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="w-fit"
                                    type="submit"
                                >
                                    Comment
                                </Button>
                            </div>
                        </form>
                    ) : null}
                </div>
            </div>
            <Tabs
                defaultValue="chapters"
                className="px-4 w-fit flex items-end flex-col gap-2 max-h-[75vh]"
            >
                <TabsList className="w-80 place-self-center">
                    <TabsTrigger
                        className="w-full"
                        value="chapters"
                    >
                        Chapters
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-full"
                        value="comments"
                    >
                        Comments
                    </TabsTrigger>
                </TabsList>
                <TabsContent
                    value="chapters"
                    className="flex flex-col gap-4 overflow-y-scroll px-2 pt-2"
                >
                    {data?.chapters
                        .sort((ch1, ch2) => ch2.descriptor - ch1.descriptor)
                        .map(chapter => (
                            <Link
                                key={chapter.id}
                                href={`${props.params.novelId}/chapter/${chapter.id}`}
                            >
                                <Card className="w-[20rem] bg-secondary">
                                    <CardHeader className="font-bold">
                                        <div className="flex justify-between">
                                            <div className="flex flex-col">
                                                Chapter {chapter.descriptor}
                                                <span className="font-medium text-sm">
                                                    {chapter.name}
                                                </span>
                                            </div>
                                            <p className="font-medium text-sm">
                                                {formatDuration(
                                                    chapter.createdAt
                                                )}
                                            </p>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                </TabsContent>
                <TabsContent
                    value="comments"
                    className="flex flex-col gap-4 overflow-y-scroll px-2"
                >
                    {comments.data?.map(comment => (
                        <Card
                            className="w-[20rem] bg-secondary"
                            key={comment.id}
                        >
                            <div className="flex justify-between px-6 pt-6 pb-2 items-center font-medium">
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src="/avatar.png" />
                                        <AvatarFallback>A</AvatarFallback>
                                    </Avatar>
                                    <h3>{comment.author.handle}</h3>
                                </div>
                                <p className="text-muted-foreground text-sm font-normal">
                                    {formatDuration(comment.createdAt)}
                                </p>
                            </div>
                            <CardContent className="text-sm">
                                {comment.content}
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
