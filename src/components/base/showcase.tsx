"use client";

import { Card, CardContent } from "@/components/shadcn/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/shadcn/carousel";
import { Novel } from "@prisma/client";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

type ShowcaseProps = {
    novels: Novel[];
};

export default function Showcase(props: ShowcaseProps) {
    // https://www.embla-carousel.com/plugins/autoplay/
    const plugins = [Autoplay({ delay: 5000 })];
    const opts = {
        loop: true,
    };

    return (
        <Carousel
            className="w-full"
            opts={opts}
            plugins={plugins}
        >
            <CarouselContent>
                {props.novels.map(novel => (
                    <CarouselItem key={novel.name}>
                        <Link href={`/novel/${novel.id}`}>
                            <div className="p-1">
                                <Card>
                                    <CardContent
                                        className="flex h-96 md:h-72 items-end rounded-lg justify-start p-6"
                                        style={{
                                            background: `url(${novel.imgPath})`,
                                            backgroundPosition: "center",
                                        }}
                                    >
                                        <h3 className="text-3xl font-semibold bg-background/60 rounded-md py-2 px-4">
                                            {novel.name}
                                        </h3>
                                    </CardContent>
                                </Card>
                            </div>
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
