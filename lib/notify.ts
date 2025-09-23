import type { SanitizedCode } from "./filter";

export interface NotifyOptions {
  webhookUrl?: string;
  fetchImpl?: typeof fetch;
}

function formatExpiry(dateIso?: string): string | undefined {
  if (!dateIso) {
    return undefined;
  }

  const parsed = new Date(dateIso);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString().split("T")[0];
}

export async function notifyNewCodes(
  items: SanitizedCode[],
  options: NotifyOptions = {},
): Promise<{ sent: boolean }> {
  if (items.length === 0) {
    return { sent: false };
  }

  const webhookUrl = options.webhookUrl ?? process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return { sent: false };
  }

  const fetcher = options.fetchImpl ?? globalThis.fetch;
  if (!fetcher) {
    throw new Error("Fetch API is not available in this environment");
  }

  const lines = items.map((item) => {
    const parts = [`**${item.code}**`];

    if (item.reward) {
      parts.push(` — ${item.reward}`);
    }

    const expiry = formatExpiry(item.expires);
    if (expiry) {
      parts.push(` (expires ${expiry})`);
    }

    if (item.source) {
      parts.push(` \u2014 ${item.source}`);
    }

    return parts.join("");
  });

  const content = [
    "🆕 New Borderlands 4 SHiFT codes detected!",
    ...lines,
  ].join("\n");

  const response = await fetcher(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send Discord notification: ${response.status}`);
  }

  return { sent: true };
}
