"use client";
import {
  useNotifications,
  typeOfNotification,
  NotificationType,
} from "@/contexts/useNotifications";
import { useEffect, useState } from "react";
import { Bell, Check, FileText, Receipt, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatFirebaseDate } from "@/lib/utils";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const getNotificationIcon = (type: typeOfNotification) => {
  switch (type) {
    case typeOfNotification.INVOICE_CREATED:
      return <Receipt className="h-4 w-4" />;
    case typeOfNotification.DOCUMENT_UPLOADED:
      return <FileText className="h-4 w-4" />;
    case typeOfNotification.TASK_CREATED:
      return <Check className="h-4 w-4" />;
    case typeOfNotification.PROJECT_STATUS_UPDATED:
      return <Activity className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationPath = (
  type: typeOfNotification,
  notificationId: string
) => {
  switch (type) {
    case typeOfNotification.INVOICE_CREATED:
      return `/invoices/${notificationId}`;
    case typeOfNotification.DOCUMENT_UPLOADED:
      return `/documents/${notificationId}`;
    case typeOfNotification.TASK_CREATED:
      return `/tasks/${notificationId}`;
    case typeOfNotification.PROJECT_STATUS_UPDATED:
      return `/projects/${notificationId}`;
    default:
      return "/dashboard";
  }
};

export default function NotificationBell({ userId }: { userId: string }) {
  const notifications = useNotifications(userId);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(
    (n: NotificationType) => !n.read
  ).length;

  useEffect(() => {
    console.log(notifications, "NOTIFICATIONS in bell!");
  }, [notifications]);

  const handleNotificationClick = async (notification: NotificationType) => {
    try {
      // Mark as read if not already read
      if (!notification.read) {
        await updateDoc(doc(db, "notifications", notification.id), {
          read: true,
        });
      }

      // Navigate to appropriate page
      // const path = getNotificationPath(notification.type, notification.id);
      // router.push(path);
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (n: NotificationType) => !n.read
      );
      await Promise.all(
        unreadNotifications.map((notification) =>
          updateDoc(doc(db, "notifications", notification.id), { read: true })
        )
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1">
          <DropdownMenuLabel className="font-semibold">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-auto p-1"
            >
              Mark all read
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification: NotificationType) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3 cursor-pointer",
                  !notification.read && "bg-accent/50"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm leading-relaxed",
                      !notification.read && "font-medium"
                    )}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatFirebaseDate(notification.createdAt)}
                  </p>
                </div>

                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
