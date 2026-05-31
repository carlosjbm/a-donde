import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-sm font-bold text-zinc-900 dark:text-zinc-100"
        >
          a-donde
        </Link>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Encuentra los mejores precios cerca de ti
        </p>
      </div>
    </footer>
  );
}
