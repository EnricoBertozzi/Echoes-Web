import type { PropsWithChildren } from "react";
import { RequireAuth } from "~/components/atoms/auth/RequireAuth";

export default function ProtectedLayout({
  children,
}: PropsWithChildren) {
  return (
    <RequireAuth>
      {children}
    </RequireAuth>
  );
}