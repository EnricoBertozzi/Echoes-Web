import clsx from "clsx";

export type UserAvatarSize = "sm" | "md" | "lg" | "xl";

export interface UserAvatarProps {
  name: string;
  size?: UserAvatarSize;
  variant?: "solid" | "outline";
  className?: string;
}

const sizeStyles: Record<UserAvatarSize, string> = {
  sm: "h-10 w-10 text-base",
  md: "h-11 w-11 text-lg",
  lg: "h-16 w-16 text-2xl",
  xl: "h-24 w-24 text-4xl",
};

export function UserAvatar({
  name,
  size = "md",
  variant = "solid",
  className,
}: UserAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      aria-hidden="true"
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        variant === "solid"
          ? "bg-main text-white"
          : "border border-white/50 text-white",
        sizeStyles[size],
        className,
      )}
    >
      {initial}
    </div>
  );
}
