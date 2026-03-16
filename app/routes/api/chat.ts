import type { Route } from "./+types/chat";

const WEBHOOK_URL = process.env.VITE_N8N_WEBHOOK_URL!;
const N8N_AUTH = process.env.VITE_N8N_AUTH ?? "";

export async function action({ request }: Route.ActionArgs) {
  const contentType = request.headers.get("content-type") ?? "";
  const accept = request.headers.get("accept") ?? "*/*";

  const headers: Record<string, string> = {
    Accept: accept,
    "Content-Type": contentType,
  };

  if (N8N_AUTH) {
    headers.authorization = N8N_AUTH;
  }

  const body = await request.arrayBuffer();

  const webhookResponse = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers,
    body,
  });

  return new Response(webhookResponse.body, {
    status: webhookResponse.status,
    headers: {
      "Content-Type":
        webhookResponse.headers.get("content-type") ?? "text/plain",
    },
  });
}
