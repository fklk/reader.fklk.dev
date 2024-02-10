import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function NovelCard() {
    // TODO: Add props to comp and implement respective data in card below
    // TODO: Change chapter color to muted if user has read the chapter
    return (
        <Card className="min-w-72 border-2 border-transparent hover:border-primary cursor-pointer">
            <Link href="/novel/{id}">
                <CardHeader className="bg-secondary font-bold py-3 rounded-t-lg">
                    From Downtown
                </CardHeader>
            </Link>
            <CardContent className="p-0 flex h-36 items-center">
                <div className="h-full w-24 rounded-bl-md overflow-hidden relative">
                    <Link href="/novel/{id}">
                        <Image
                            src="/showcase/showcase_4.jpg"
                            alt="Cover image"
                            fill
                            className="object-cover"
                        />
                    </Link>
                </div>
                <ul className="flex flex-col gap-1 flew-grow items-center font-medium [&>li]:w-fit [&>li]:px-2">
                    <li className="flex gap-4 items-center">
                        <Link
                            href="/novel/{id}/{chapterId}"
                            className="hover:bg-accent cursor-pointer py-1 px-2 rounded-md"
                        >
                            Chapter 4
                        </Link>
                        <span className="text-muted-foreground font-normal text-sm">
                            2h ago
                        </span>
                    </li>
                    <li className="flex gap-4 items-center">
                        <Link
                            href="/novel/{id}/{chapterId}"
                            className="hover:bg-accent cursor-pointer py-1 px-2 rounded-md"
                        >
                            Chapter 3
                        </Link>
                        <span className="text-muted-foreground font-normal text-sm">
                            1w ago
                        </span>
                    </li>
                    <li className="flex gap-4 items-center">
                        <Link
                            href="/novel/{id}/{chapterId}"
                            className="hover:bg-accent cursor-pointer py-1 px-2 rounded-md"
                        >
                            Chapter 2
                        </Link>
                        <span className="text-muted-foreground font-normal text-sm">
                            2w ago
                        </span>
                    </li>
                    <li className="flex gap-4 items-center">
                        <Link
                            href="/novel/{id}/{chapterId}"
                            className="hover:bg-accent cursor-pointer py-1 px-2 rounded-md"
                        >
                            Chapter 4
                        </Link>
                        <span className="text-muted-foreground font-normal text-sm">
                            3w ago
                        </span>
                    </li>
                </ul>
            </CardContent>
        </Card>
    );
}
