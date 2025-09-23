import { loadActiveBl4Codes } from "@/lib/bl4";

export const runtime = "edge";

export async function GET(): Promise<Response> {
  try {
    const data = await loadActiveBl4Codes();
    const body = data.items.map((item) => item.code).join("\n");

    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Failed to load BL4 codes for text export", error);
    return new Response("Upstream unavailable", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }
}
