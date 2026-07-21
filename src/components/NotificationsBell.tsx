import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  useNotifications,
  markAllRead,
  clearNotifications,
} from "@/lib/notifications";
import { useState } from "react";

const timeAgo = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export function NotificationsBell() {
  const notifications = useNotifications();
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o && unread > 0) setTimeout(markAllRead, 400);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <p className="text-sm font-medium">Notifications</p>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <>
                <Button variant="ghost" size="sm" onClick={markAllRead} className="h-7 px-2">
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={clearNotifications} className="h-7 px-2">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="max-h-96 overflow-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 px-4">
              No notifications yet
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="px-3 py-2.5 border-b last:border-0 hover:bg-muted/40"
              >
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(n.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
