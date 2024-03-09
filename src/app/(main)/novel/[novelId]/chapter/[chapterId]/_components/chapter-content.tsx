"use client";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/app/_components/ui/hover-card";
import { Separator } from "@/app/_components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/trpc/react";

type ChapterContentProps = {
    content: string;
    insights: {
        trigger: string;
        content: string;
    }[];
    chapterId: string;
    novelId: string;
    isRead: boolean;
    userSettings: {
        fontSize: string | undefined;
        lineHeight: string | undefined;
        fontFamily: string | undefined;
    };
};

export default function ChapterContent(props: ChapterContentProps) {
    const [isRead, setIsRead] = useState<boolean>(props.isRead);
    const chapterContentRef = useRef<HTMLDivElement>(null);
    const setChapterReadMutation = api.chapter.setRead.useMutation();

    const markAsRead = () => {
        setChapterReadMutation.mutate({
            id: props.chapterId,
            novelId: props.novelId,
        });
        setIsRead(true);
        toast("Chapter has been marked as read.");
    };

    const handleScroll = () => {
        if (!chapterContentRef.current) {
            return;
        }

        if (
            chapterContentRef.current.getBoundingClientRect().bottom <=
                window.innerHeight &&
            !isRead
        ) {
            markAsRead();
        }
    };

    useEffect(() => {
        if (!isRead) {
            if (chapterContentRef.current) {
                if (
                    chapterContentRef.current.getBoundingClientRect().height <
                    window.innerHeight
                ) {
                    markAsRead();
                }
            }
            document.addEventListener("scroll", handleScroll);

            return () => {
                document.removeEventListener("scroll", handleScroll);
            };
        }
    });

    return (
        <div
            ref={chapterContentRef}
            className="h-fit flex flex-col gap-2"
        >
            {props.content.split("\\n").map((p, i) => (
                <p
                    key={i}
                    className="leading-7 text-justify"
                >
                    {insightify(p, props.insights)}
                </p>
            ))}
        </div>
    );
}

const insightify = (
    paragraph: string,
    insights: { trigger: string; content: string }[]
) => {
    const words = paragraph.split(" ");

    return (
        <>
            {words.map((word, i) => (
                <span key={word + "_" + i}>
                    {(insights.find(insight => insight.trigger === word) && (
                        <>
                            <HoverCard>
                                <HoverCardTrigger className="border-b border-dotted border-primary">
                                    {word}
                                </HoverCardTrigger>
                                <HoverCardContent className="flex flex-col gap-2">
                                    {insights
                                        .filter(
                                            insight => insight.trigger === word
                                        )
                                        .map((insight, i) => (
                                            <div
                                                key={
                                                    insight.trigger +
                                                    "_insight_" +
                                                    i
                                                }
                                            >
                                                {insight.content}
                                                {i ===
                                                insights.filter(
                                                    insight =>
                                                        insight.trigger === word
                                                ).length -
                                                    1 ? null : (
                                                    <Separator />
                                                )}
                                            </div>
                                        ))}
                                </HoverCardContent>
                            </HoverCard>
                            {i === words.length - 1 ? "" : " "}
                        </>
                    )) ||
                        word + (i === words.length - 1 ? "" : " ")}
                </span>
            ))}
        </>
    );
};
