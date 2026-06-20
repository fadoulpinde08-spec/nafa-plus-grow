type Props = { size?: number; variant?: "full" | "mark" };

export function Logo({ size = 56, variant = "mark" }: Props) {
  return (
    <div className="flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Nafa+ logo"
      >
        {/* Shield */}
        <path
          d="M32 3 L57 12 V31 C57 46 46 56 32 61 C18 56 7 46 7 31 V12 Z"
          fill="var(--primary)"
        />
        <path
          d="M32 3 L57 12 V31 C57 46 46 56 32 61 C18 56 7 46 7 31 V12 Z"
          stroke="var(--primary-deep)"
          strokeWidth="1.5"
        />
        {/* Shop awning */}
        <rect x="16" y="24" width="32" height="5" rx="1" fill="var(--gold)" />
        <path d="M16 29 L20 29 L19 34 L17 34 Z M22 29 L26 29 L25 34 L23 34 Z M28 29 L32 29 L31 34 L29 34 Z M34 29 L38 29 L37 34 L35 34 Z M40 29 L44 29 L43 34 L41 34 Z" fill="var(--primary-deep)" opacity="0.35" />
        {/* Shop body */}
        <rect x="18" y="34" width="28" height="16" rx="1" fill="white" opacity="0.95" />
        <rect x="29" y="40" width="6" height="10" fill="var(--primary)" />
        {/* Up arrow */}
        <path
          d="M22 22 L30 14 L35 19 L44 10"
          stroke="var(--gold)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M40 9 L46 9 L46 15" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      {variant === "full" && (
        <span className="text-2xl font-extrabold tracking-tight text-primary">
          Nafa<span className="text-gold">+</span>
        </span>
      )}
    </div>
  );
}
