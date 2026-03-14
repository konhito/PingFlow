import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { db } from "@/db";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const GET = async () => {
  const keys = await redis.keys("quota:*");

  const syncPromises = keys.map(async (key) => {
    const [_, userId, year, month] = key.split(":");
    const count = await redis.get<number>(key);

    if (count === null) return;

    try {
      await db.quota.upsert({
        where: {
          userId_year_month: {
            userId,
            year: parseInt(year),
            month: parseInt(month),
          },
        },
        update: { count },
        create: {
          userId,
          year: parseInt(year),
          month: parseInt(month),
          count,
        },
      });
    } catch (error) {
      console.error(`failed to sync quota for ${userId}`, error);
    }
  });

  await Promise.all(syncPromises);

  return NextResponse.json({ message: "sync complete" }, { status: 200 });
};
