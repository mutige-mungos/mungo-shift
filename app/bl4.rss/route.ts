import { loadActiveBl4Codes } from "@/lib/bl4";

export const runtime = "edge";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  try {
    const data = await loadActiveBl4Codes();
    const siteUrl = process.env.SITE_URL ?? "https://example.com";

    const items = data.items
      .map((item) => {
        const titleParts = [item.code];
        if (item.reward) {
          titleParts.push(` — ${item.reward}`);
        }

        if (item.expires) {
          titleParts.push(` (expires ${item.expires})`);
        }

        const title = escapeXml(titleParts.join(""));
        const description = escapeXml(
          [
            `Code: ${item.code}`,
            item.reward ? `Reward: ${item.reward}` : null,
            item.expires ? `Expires: ${item.expires}` : null,
            item.source ? `Source: ${item.source}` : null,
          ]
            .filter(Boolean)
            .join(" | "),
        );

        const guid = escapeXml(item.code);
        const link = `${siteUrl}/?code=${encodeURIComponent(item.code)}`;

        return [
          "    <item>",
          `      <title>${title}</title>`,
          `      <link>${escapeXml(link)}</link>`,
          `      <guid isPermaLink=\"false\">${guid}</guid>`,
          `      <description>${description}</description>`,
          "    </item>",
        ].join("\n");
      })
      .join("\n");

    const rss = [
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
      "<rss version=\"2.0\">",
      "  <channel>",
      "    <title>Borderlands 4 SHiFT codes</title>",
      `    <link>${escapeXml(siteUrl)}</link>`,
      "    <description>Active Borderlands 4 SHiFT codes aggregated from the public feed.</description>",
      `    <lastBuildDate>${new Date(data.updatedAt).toUTCString()}</lastBuildDate>`,
      items,
      "  </channel>",
      "</rss>",
    ].join("\n");

    return new Response(rss, {
      status: 200,
      headers: {
        "content-type": "application/rss+xml; charset=utf-8",
        "cache-control": "s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Failed to load BL4 codes for RSS", error);
    return new Response("Upstream unavailable", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }
}
