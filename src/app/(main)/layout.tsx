import { Toaster } from "../../components/shadcn/sonner";
import Header from "../../components/base/header/header";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="flex flex-col w-full">
                <Header />
                {children}
            </div>
            <Toaster />
        </>
    );
}
