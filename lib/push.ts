import webpush from "web-push";
import { prisma } from "./prisma";

webpush.setVapidDetails(
  "mailto:loran@app.local",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

type Sub = { id: string; endpoint: string; p256dh: string; auth: string };
type Payload = { title: string; body: string; url?: string };

async function sendToSubscriptions(subs: Sub[], payload: Payload) {
  await Promise.allSettled(
    subs.map((sub) =>
      webpush
        .sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload)
        )
        .catch(async (err: { statusCode?: number }) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } });
          }
        })
    )
  );
}

export async function sendPushToUser(userId: string, payload: Payload) {
  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  await sendToSubscriptions(subs, payload);
}

export async function sendPushToOthers(excludeUserId: string, payload: Payload) {
  const subs = await prisma.pushSubscription.findMany({
    where: { userId: { not: excludeUserId } },
  });
  await sendToSubscriptions(subs, payload);
}
