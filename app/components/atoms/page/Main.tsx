import type React from "react";

export interface MainProps {
    children: React.ReactNode;
}

export function Main({children}: MainProps) {
    return(
        <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 max-lg:wrap-anywhere sm:px-6 lg:gap-8 lg:px-12 lg:py-16">
            {children}
        </main>
    );
}

