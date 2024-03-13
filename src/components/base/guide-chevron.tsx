"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function GuideChevron() {
    const [showGuide, setShowGuide] = useState<boolean>(true);

    const disableGuide = () => {
        if (showGuide) {
            setShowGuide(false);
        }
    };

    useEffect(() => {
        document.addEventListener("scroll", disableGuide);

        return () => {
            document.removeEventListener("scroll", disableGuide);
        };
    });

    return showGuide ? (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse">
            <ChevronDown
                className="w-14 h-14"
                strokeWidth={0.75}
            />
        </div>
    ) : null;
}
