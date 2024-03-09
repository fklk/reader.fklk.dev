export default function NovelListLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="flex flex-col gap-6 mt-8">{children}</div>;
}
