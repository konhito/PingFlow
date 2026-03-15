import Queue from "bull";

export const deadLetterQueue = new Queue(
  "dead-letter-queue",
  process.env.REDIS_URL || "redis://localhost:6379",
);
