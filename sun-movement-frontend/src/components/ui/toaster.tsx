"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-4 sm:right-4 sm:flex-col md:max-w-[380px]">
      {toasts
        .filter((toast) => toast.open !== false)
        .map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props} className="mb-2">
              <div className="grid gap-1">
                {title && <ToastTitle className="text-sm font-medium">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-xs">{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          );
        })}
    </div>
  );
}
