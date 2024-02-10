import Header from "./_components/header";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col w-full">
            <Header />
            {children}
        </div>
    );
}
