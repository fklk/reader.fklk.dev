"use client";

import { Card, CardContent } from "@/app/_components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/app/_components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import Link from "next/link";

export default function Showcase() {
    // https://www.embla-carousel.com/plugins/autoplay/
    const plugins = [Autoplay({ delay: 5000 })];
    const opts = {
        loop: true,
    };

    const showcaseImages = [
        { path: "/showcase/showcase_1.jpg", name: "The Swordmaster" },
        { path: "/showcase/showcase_2.jpg", name: "A Mage's Tale" },
        { path: "/showcase/showcase_3.jpg", name: "Who I Am" },
        { path: "/showcase/showcase_4.jpg", name: "From Downtown" },
        { path: "/showcase/showcase_5.jpg", name: "Fuck Dragons" },
        { path: "/showcase/showcase_6.jpg", name: "Been here Before" },
        { path: "/showcase/showcase_7.jpg", name: "Melancholia" },
    ];

    return (
        <Carousel
            className="w-full"
            opts={opts}
            plugins={plugins}
        >
            <CarouselContent>
                {showcaseImages.map(image => (
                    <CarouselItem key={image.name}>
                        <Link href="/novel/{id}">
                            <div className="p-1">
                                <Card>
                                    <CardContent
                                        className="flex h-96 md:h-72 items-end rounded-lg justify-start p-6"
                                        style={{
                                            background: `url(${image.path})`,
                                            backgroundPosition: "center",
                                        }}
                                    >
                                        <h3 className="text-3xl text-white font-semibold">
                                            {image.name}
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
