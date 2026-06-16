function StarSvg({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function StarRating({
  value,
  onChange,
  size = "sm",
  interactive = false,
}: {
  value: number | null;
  onChange?: (val: number) => void;
  size?: "sm" | "md";
  interactive?: boolean;
}) {
  const stars = value ? Math.round(value) : 0;
  const cls = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) =>
        interactive && onChange ? (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`${cls} transition-colors ${
              s <= stars
                ? "text-amber-400"
                : "text-zinc-300 dark:text-zinc-600"
            } hover:text-amber-400`}
            aria-label={`${s} estrella${s !== 1 ? "s" : ""}`}
          >
            <StarSvg className={cls} />
          </button>
        ) : (
          <span
            key={s}
            className={`${cls} ${
              s <= stars
                ? "text-amber-400"
                : "text-zinc-300 dark:text-zinc-600"
            }`}
          >
            <StarSvg className={cls} />
          </span>
        ),
      )}
    </span>
  );
}
