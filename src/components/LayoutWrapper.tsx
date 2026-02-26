"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import ChatWidget from "./ChatWidget";

export default function LayoutWrapper({
    children,
    footer,
}: {
    children: React.ReactNode;
    footer: React.ReactNode;
}) {
    const pathname = usePathname();
    const isDashboardOrAuth = pathname?.startsWith("/dashboard") || pathname?.startsWith("/login");

    if (isDashboardOrAuth) {
        return (
            <main className="min-h-screen bg-background text-slate-100">
                {children}
            </main>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            {footer}
            <ChatWidget />
        </>
    );
}
