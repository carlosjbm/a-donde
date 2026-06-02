"use client";

import { useState } from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  id,
}: SwitchProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <label
      htmlFor={id}
      className={`group inline-flex select-none items-center gap-2 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onBlur={() => setPressed(false)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 ${
          checked
            ? "border-emerald-600 bg-emerald-500 dark:border-emerald-500 dark:bg-emerald-600"
            : "border-zinc-300 bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-700"
        } ${pressed ? "scale-95" : "scale-100"}`}
      >
        <span
          aria-hidden
          className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
            checked ? "translate-x-[18px]" : "translate-x-[3px]"
          }`}
        />
      </button>
    </label>
  );
}
