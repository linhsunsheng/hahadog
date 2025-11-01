"use client"
import { useRef } from "react";

export default function ConfirmDialog({
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  children,
}: {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  children: (open: () => void) => React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = () => ref.current?.showModal();
  const close = () => ref.current?.close();
  return (
    <>
      {children(open)}
      <dialog ref={ref} className="rounded-xl p-0">
        <form method="dialog" className="min-w-[320px] rounded-xl bg-white p-5 shadow-xl">
          <h3 className="mb-2 text-lg font-semibold">{title}</h3>
          <p className="mb-4 text-sm text-black/70">{message}</p>
          <div className="flex justify-end gap-2">
            <button className="btn btn-outline" onClick={close}>{cancelText}</button>
            <button className="btn btn-primary" onClick={async () => { await onConfirm(); close(); }}>{confirmText}</button>
          </div>
        </form>
      </dialog>
    </>
  );
}

