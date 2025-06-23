import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/sendEmail";
import { redis } from "@/lib/redis";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema"; // assuming the table is `user`

type UserState = "non-active" | "active";

type InitialData = {
  email: string;
  fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (result.length === 0) return "non-active";

  const lastActivityDate = new Date(result[0].lastActivityDate!);
  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();

  if (timeDifference > THREE_DAYS_IN_MS && timeDifference <= THIRTY_DAYS_IN_MS) {
    return "non-active";
  }

  return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  // Send initial welcome email
  await sendEmail(
    "Welcome to the platform",
    email,
    `Welcome ${fullName}`
  );

  // Set initial Redis user status
  await redis.set(`user:${email}:status`, "new");

  // Wait for 3 days
  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail(
          "We miss you!",
          email,
          `Hey ${fullName}, we noticed you haven't been around. Come back and check out what's new!`
        );
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail(
          "Welcome back",
          email,
          `Welcome back ${fullName}! We're glad you're active again.`
        );
      });
    }

    // Wait for another 30 days before rechecking
    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});
