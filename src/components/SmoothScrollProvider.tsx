"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        setLenisInstance(lenis);

        return () => {
            lenis.destroy();
            setLenisInstance(null);
        };
    }, []);

    // Effect para resetar o scroll ao mudar de rota
    useEffect(() => {
        if (lenisInstance) {
            lenisInstance.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0); // Fallback imediato
        }
    }, [pathname, lenisInstance]);

    return <>{children}</>;
}
