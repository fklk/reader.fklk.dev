import NovelCard from "../_components/novel-card";
import Showcase from "./_components/showcase";

export default async function Home() {
    return (
        <div>
            <Showcase />
            <div className="mt-10">
                <h1 className="text-2xl font-bold">Continue Reading</h1>
                <div className="flex gap-8 overflow-x-scroll py-2">
                    <NovelCard />
                    <NovelCard />
                    <NovelCard />
                    <NovelCard />
                    <NovelCard />
                </div>
            </div>
        </div>
    );
}
