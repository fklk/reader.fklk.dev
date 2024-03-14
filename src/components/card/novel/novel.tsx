import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { formatDuration } from "@/lib/utils";
import { api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";

type NovelCardProps = {
    novelId: string;
    redirectTo: "NOVEL_PAGE" | "EDIT_PAGE";
};

export default async function NovelCard(props: NovelCardProps) {
    const novel = await api.novel.getById.query({ id: props.novelId });
    const chapters = await api.chapter.getAll.query({
        novelId: props.novelId,
        limit: 4,
    });

    const redirectUrl = `/novel/${props.novelId}${
        props.redirectTo === "EDIT_PAGE" ? "/edit" : ""
    }`;

    return (
        <Card className="min-w-72 ring-2 h-fit ring-transparent hover:ring-primary cursor-pointer ring-offset-4 ring-offset-background">
            <Link href={redirectUrl}>
                <CardHeader className="bg-secondary font-bold py-3 rounded-t-lg">
                    {novel?.name}
                </CardHeader>
            </Link>
            <CardContent className="p-0 flex h-36 items-center">
                <div className="h-full w-24 rounded-bl-md overflow-hidden relative">
                    <Link href={redirectUrl}>
                        <Image
                            src={novel?.imgPath!}
                            alt="Cover image"
                            fill
                            className="object-cover"
                        />
                    </Link>
                </div>
                {chapters.length > 0 ? (
                    <table className="flex-grow h-full">
                        <tbody className="flex flex-col gap-2 py-2 h-full font-medium">
                            {chapters.map(ch => (
                                <tr
                                    className="flex items-center justify-center"
                                    key={ch.id}
                                >
                                    <td>
                                        <Link
                                            href={`/novel/${props.novelId}/chapter/${ch.id}`}
                                            className="hover:bg-accent cursor-pointer py-1 px-2 rounded-md"
                                        >
                                            Chapter {ch.descriptor}
                                        </Link>
                                    </td>
                                    <td className="font-normal text-sm min-w-20 text-center">
                                        {formatDuration(ch.createdAt)}
                                    </td>
                                    {/* <td className="text-center min-w-12">
                                    {props.unreadChapters
                                        .filter(
                                            c => c.descriptor > ch.descriptor
                                        )
                                        .map(c => c.id)
                                        .includes(ch.id) ? (
                                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                    ) : null}
                                </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : null}
                {chapters.length === 0 ? (
                    <h5 className="text-sm text-muted-foreground mx-auto">
                        No chapters yet
                    </h5>
                ) : null}
            </CardContent>
        </Card>
    );
}
