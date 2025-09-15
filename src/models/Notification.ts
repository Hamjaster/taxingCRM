import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  _id: string;
  senderId?: mongoose.Types.ObjectId;       // who triggered this
  senderModel?: "Client" | "Admin";         // sender type
  recipientId: mongoose.Types.ObjectId;     // who will receive this
  recipientModel: "Client" | "Admin";       // recipient type
  type: "DOCUMENT" | "INVOICE" | "TASK" | "PROJECT_STATUS";
  title: string;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      refPath: "senderModel", // dynamic reference to Admin/Client
    },
    senderModel: {
      type: String,
      enum: ["Client", "Admin"],
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "recipientModel",
    },
    recipientModel: {
      type: String,
      enum: ["Client", "Admin"],
      required: true,
    },
    type: {
      type: String,
      enum: ["DOCUMENT", "INVOICE", "TASK", "PROJECT_STATUS"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
