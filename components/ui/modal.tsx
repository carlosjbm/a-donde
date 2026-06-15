import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center py-4 sm:items-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-10 mx-4 w-full max-w-md max-h-[85vh] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-lg sm:p-6 dark:border-zinc-700 dark:bg-zinc-900">
        {children}
      </div>
    </div>
  );
}
