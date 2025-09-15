import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendNotificationEmail, NotificationEmailData } from "./email-utils";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export async function createNotification({
  receiverId,
  senderId,
  type,
  message,
  emailData,
}: {
  receiverId: string;
  senderId: string;
  type: string;
  message: string;
  emailData?: NotificationEmailData;
}) {
  // Create Firebase notification
  const docRef = await addDoc(collection(db, "notifications"), {
    receiverId,
    senderId,
    type,
    message,
    read: false,
    createdAt: serverTimestamp(),
  });

  // Send email notification if email data is provided
  if (emailData) {
    try {
      await sendNotificationEmail(emailData);
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // Don't throw error to prevent breaking the notification flow
    }
  }

  return docRef.id;
}

import { Timestamp } from "firebase/firestore";

export function formatFirebaseDate(createdAt?: Timestamp) {
   if (!createdAt) return "";
  const date = createdAt.toDate();

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short", // Jan, Feb
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
