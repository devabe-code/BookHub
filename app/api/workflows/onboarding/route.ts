import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema";
import { serve } from "@upstash/workflow/nextjs"
import { sendEmail } from "@/lib/workflow";
type UserState = "non-active" | "active"

type InitialData = {
  email: string
  fullName: string
};

const ONE_DAY_IN_MS = 60 * 60 * 24 * 1000;
const THREE_DAYS_IN_MS = ONE_DAY_IN_MS * 3;
const THIRTY_DAYS_IN_MS = ONE_DAY_IN_MS * 30;

const getUserState = async(email: string): Promise<UserState> => {
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if(user.length === 0) return "non-active";

  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const now = new Date();

  const timeDifference = now.getTime() - lastActivityDate.getTime();

  if(timeDifference > THREE_DAYS_IN_MS && timeDifference < THIRTY_DAYS_IN_MS) return "non-active";
  
  return "active";
}

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload

  // Welcome email
  await context.run("new-signup", async () => {
    await sendEmail({
      email, subject: "Welcome to the platform", message: `Hi ${fullName}, welcome to the platform!`
    })
  })

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3)

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email)
    })

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email,
          subject: "Are you still there?",
          message: "We miss you! Please come back and check out our new features!",
        }
        )
      })
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        // Get user's first name in message
        const firstName = fullName.split(" ")[0];
        await sendEmail({
          email,
          subject: "Welcome back!",
          message: `Hi ${firstName}, we missed you!`
          })
      })
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30)
  }
})

