import { getUserInitial } from "@/lib/utils";

interface UserBadgeProps {
  name: string;
  size?: "sm" | "md";
}

export default function UserBadge({ name, size = "sm" }: UserBadgeProps) {
  const sizeClass = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full bg-espresso flex items-center justify-center text-white font-semibold shrink-0`}
      title={name}
    >
      {getUserInitial(name)}
    </div>
  );
}
