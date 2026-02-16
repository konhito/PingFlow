"use strict";
// Shared TypeScript types for all microservices
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaTopics = void 0;
var KafkaTopics;
(function (KafkaTopics) {
    KafkaTopics["EVENTS_INCOMING"] = "events.incoming";
    KafkaTopics["EVENTS_PROCESSED"] = "events.processed";
    KafkaTopics["NOTIFICATIONS_DISCORD"] = "notifications.discord";
    KafkaTopics["NOTIFICATIONS_WHATSAPP"] = "notifications.whatsapp";
    KafkaTopics["NOTIFICATIONS_TELEGRAM"] = "notifications.telegram";
    KafkaTopics["NOTIFICATIONS_EMAIL"] = "notifications.email";
    KafkaTopics["NOTIFICATIONS_STATUS"] = "notifications.status";
    KafkaTopics["EVENTS_FAILED"] = "events.failed";
})(KafkaTopics || (exports.KafkaTopics = KafkaTopics = {}));
