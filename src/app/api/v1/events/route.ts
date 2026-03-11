import { FREE_QUOTA, PRO_QUOTA } from "@/config";
import { db } from "@/db";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator";
import { createKafkaClient } from "@pingflow/kafka-client";
import { KafkaTopics, KafkaEvent } from "@pingflow/shared-types";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";

const REQUEST_VALIDATOR = z.object({
  category: CATEGORY_NAME_VALIDATOR,
  fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
  description: z.string().optional(),
}).strict()

// Lazy-initialize Kafka client
let kafkaClient: ReturnType<typeof createKafkaClient> | null = null;

function getKafkaClient() {
  if (!kafkaClient) {
    kafkaClient = createKafkaClient(process.env.KAFKA_BROKERS);
  }
  return kafkaClient;
}

export const POST = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          message: "Invalid auth header format. Expected: 'Bearer [API_KEY]'",
        },
        { status: 401 }
      )
    }

    const apiKey = authHeader.split(" ")[1]

    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { apiKey },
      include: { EventCategories: true },
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 })
    }

    // Check if user has at least one notification channel configured
    const hasNotificationChannel = user.discordId || user.telegramId || user.whatsappId
    if (!hasNotificationChannel) {
      return NextResponse.json(
        { message: "Please configure at least one notification channel (Discord, Telegram, or WhatsApp) in your account settings" },
        { status: 403 }
      )
    }

    // Quota check
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    const quota = await db.quota.findUnique({
      where: {
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
    })

    const quotaLimit =
      user.plan === "FREE"
        ? FREE_QUOTA.maxEventsPerMonth
        : PRO_QUOTA.maxEventsPerMonth

    if (quota && quota.count >= quotaLimit) {
      return NextResponse.json(
        {
          message: "Monthly quota reached. Please upgrade your plan for more events",
        },
        { status: 429 }
      )
    }

    // Parse request body
    let requestData: unknown
    try {
      requestData = await req.json()
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON request body" },
        { status: 400 }
      )
    }

    const validationResult = REQUEST_VALIDATOR.parse(requestData)

    const category = user.EventCategories.find(
      (cat: any) => cat.name === validationResult.category
    )

    if (!category) {
      return NextResponse.json(
        {
          message: `You don't have a category named "${validationResult.category}"`,
        },
        { status: 404 }
      )
    }

    // Increment quota optimistically
    await db.quota.upsert({
      where: { userId: user.id, month: currentMonth, year: currentYear },
      update: { count: { increment: 1 } },
      create: {
        userId: user.id,
        month: currentMonth,
        year: currentYear,
        count: 1,
      },
    })

    // Build Kafka event payload
    const eventId = randomUUID()
    const kafkaEvent: KafkaEvent = {
      eventId,
      userId: user.id,
      category: {
        id: category.id,
        name: category.name,
        emoji: category.emoji || "🔔",
        color: category.color,
        userId: user.id,
      },
      fields: validationResult.fields || {},
      description: validationResult.description,
      timestamp: new Date().toISOString(),
    }

    // Publish to Kafka for async processing
    const kafka = getKafkaClient()
    await kafka.publishEvent(KafkaTopics.EVENTS_INCOMING, kafkaEvent)

    return NextResponse.json({
      message: "Event queued for processing",
      eventId,
    })
  } catch (error) {
    console.error(error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 422 })
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
