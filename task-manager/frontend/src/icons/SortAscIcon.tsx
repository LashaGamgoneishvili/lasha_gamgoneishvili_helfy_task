import type { IconProps } from "./IconProps";

export const SortAscIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m11 12-4-4-4 4" />
    <path d="M7 16V8" />
    <path d="M21 8h-9" />
    <path d="M21 12h-7" />
    <path d="M21 16h-5" />
  </svg>
);
