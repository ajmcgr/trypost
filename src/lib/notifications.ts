import { useSyncExternalStore } from "react";
import { toast as sonnerToast } from "sonner";

export type Notification = {
  id: string;
  message: string;
  createdAt: number;
  read: boolean;
};

const STORAGE_KEY = "post_notifications_v1";

const load = (): Notification[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

let notifications: Notification[] = load();
const listeners = new Set<() => void>();

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, 50)));
  } catch {}
};

const emit = () => {
  persist();
  listeners.forEach((l) => l());
};

export const addNotification = (message: string) => {
  const n: Notification = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message,
    createdAt: Date.now(),
    read: false,
  };
  notifications = [n, ...notifications].slice(0, 50);
  emit();
};

export const markAllRead = () => {
  notifications = notifications.map((n) => ({ ...n, read: true }));
  emit();
};

export const clearNotifications = () => {
  notifications = [];
  emit();
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const useNotifications = () =>
  useSyncExternalStore(subscribe, () => notifications, () => notifications);

// Patch sonner's toast.success so all success toasts also land in the bell.
let patched = false;
export const initNotificationsPatch = () => {
  if (patched) return;
  patched = true;
  const orig = sonnerToast.success.bind(sonnerToast);
  (sonnerToast as any).success = (message: any, opts?: any) => {
    try {
      const text =
        typeof message === "string"
          ? message
          : typeof message === "object" && message?.props?.children
          ? String(message.props.children)
          : String(message);
      addNotification(text);
    } catch {}
    return orig(message, opts);
  };
};
