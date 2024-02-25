import { ReadrIcon } from "@/app/_components/icon";

export default function Loading() {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <ReadrIcon className="w-32 h-32 animate-ping" />
        </div>
    );
}
