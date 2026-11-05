import type React from "react";

export interface MainProps {
    children: React.ReactNode;
}

export function Main({children}: MainProps) {
    return(
        <main className="min-w-0 flex-1 flex flex-col gap-8 px-12 py-16">
            {children}
        </main>
    );
}

