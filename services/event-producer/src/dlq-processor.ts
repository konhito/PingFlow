import { deadLetterQueue } from "@pingflow/dead-letter";
import { logger } from "@pingflow/logger";
import { createKafkaClient } from "@pingflow/kafka-client";
import { KafkaTopics } from "@pingflow/shared-types";

const kafka = createKafkaClient(process.env.KAFKA_BROKERS);

deadLetterQueue.process(async (job) => {
  const { failedService, failReason, failedAt, ...originalPayload } = job.data;

  if (failReason.includes("invalid") || failReason.includes("not found")) {
    // log it, notify admin, skip
    // TODO: make prisma client call in the admin make a schema.
    logger.error({ job }, "Permanent failure - manual intervention needed");
    return;
  }

  const topicMap: Record<string, string> = {
    telegram: KafkaTopics.NOTIFICATIONS_TELEGRAM,
    discord: KafkaTopics.NOTIFICATIONS_DISCORD,
    whatsapp: KafkaTopics.NOTIFICATIONS_WHATSAPP,
  };

  const topic = topicMap[failedService];
  if (!topic) return;

  await new Promise((resolve) => setTimeout(resolve, 60 * 60 * 1000)); // 1 hour
  await kafka.publishEvent(topic, originalPayload);
});
