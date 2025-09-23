import { loadActiveBl4Codes } from "@/lib/bl4";

export const runtime = "edge";

export async function GET(): Promise<Response> {
  try {
    const data = await loadActiveBl4Codes();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Failed to load BL4 codes", error);
    return new Response(JSON.stringify({ error: "Upstream unavailable" }), {
      status: 502,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }
}
