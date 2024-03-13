import { Card, CardContent } from "@/components/shadcn/card";
import { capitalize } from "@/lib/utils";
import { Chapter, Genre, Novel, User } from "@prisma/client";

type NovelInfoCardProps = {
    novel: Novel & { author: User; genre: Genre; chapters: Chapter[] };
};

export default function NovelInfoCard({ novel }: NovelInfoCardProps) {
    return (
        <Card className="w-fit">
            <CardContent className="p-4 bg-secondary">
                <table>
                    <tbody>
                        <tr>
                            <th className="pr-8 text-left">Author</th>
                            <td>{novel.author.handle}</td>
                        </tr>
                        <tr>
                            <th className="pr-8 text-left">Genre</th>
                            <td>{novel.genre.name}</td>
                        </tr>
                        <tr>
                            <th className="pr-8 text-left">Chapters</th>
                            <td>{novel.chapters.length}</td>
                        </tr>
                        <tr>
                            <th className="pr-8 text-left">Status</th>
                            <td>{capitalize(novel.status)}</td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
