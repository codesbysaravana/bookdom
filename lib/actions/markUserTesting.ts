// lib/actions/markUserActive.ts
import { redis } from "@/lib/redis";

export async function markUserActive(email: string) {
  await redis.set(`user:${email}:status`, "active");
}
