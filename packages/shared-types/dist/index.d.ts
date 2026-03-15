export interface Event {
  id: string;
  userId: string;
  categoryId: string;
  category: EventCategory;
  fields: Record<string, any>;
  description?: string;
  createdAt: Date;
}
export interface UserNotificationChannels {
  discordId: string | null;
  telegramId: string | null;
  whatsappId: string | null;
  notificationEmail: string | null;
}
export interface EventCategory {
  id: string;
  name: string;
  emoji: string;
  color: number;
  userId: string;
}
export interface User {
  id: string;
  email: string;
  discordId?: string | null;
  telegramId?: string | null;
  whatsappId?: string | null;
  notificationEmail?: string | null;
}
export interface KafkaEvent {
  eventId: string;
  userId: string;
  category: EventCategory;
  fields: Record<string, any>;
  description?: string;
  timestamp: string;
}
export interface NotificationPayload {
  event: KafkaEvent;
  user: User;
}
export interface DeliveryStatus {
  eventId: string;
  channel: "discord" | "whatsapp" | "telegram" | "email";
  status: "pending" | "sent" | "failed";
  error?: string;
  timestamp: string;
}
export declare enum KafkaTopics {
  EVENTS_INCOMING = "events.incoming",
  EVENTS_PROCESSED = "events.processed",
  NOTIFICATIONS_DISCORD = "notifications.discord",
  NOTIFICATIONS_WHATSAPP = "notifications.whatsapp",
  NOTIFICATIONS_TELEGRAM = "notifications.telegram",
  NOTIFICATIONS_EMAIL = "notifications.email",
  NOTIFICATIONS_STATUS = "notifications.status",
  EVENTS_FAILED = "events.failed",
}
