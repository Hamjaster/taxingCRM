import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

export enum typeOfNotification {
  INVOICE_CREATED = "INVOICE_CREATED",
  DOCUMENT_UPLOADED = "DOCUMENT_UPLOADED",
  TASK_CREATED = "TASK_CREATED",
  PROJECT_STATUS_UPDATED = "PROJECT_STATUS_UPDATED",
}

export type NotificationType = {
  id: string;
  receiverId: string;
  senderId: string;
  type: typeOfNotification;
  message: string;
  read: boolean;
  createdAt: Timestamp;
};

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "notifications"),
      where("receiverId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(snapshot, "NEW Data INCOMING !");
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(docs, "NEW Data INCOMING !");
      setNotifications(docs);
    });

    return () => unsubscribe();
  }, [userId]);

  return notifications;
}
