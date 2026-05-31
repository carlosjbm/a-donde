import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function Card({ title, children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 ${className}`}
      {...props}
    >
      {title && (
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
