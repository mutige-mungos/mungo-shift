import { loadActiveBl4Codes } from "@/lib/bl4";
import { diffNew, saveSeen } from "@/lib/store";
import { notifyNewCodes } from "@/lib/notify";

export const runtime = "nodejs";

function isAuthorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return true;
  }

  const header = request.headers.get("authorization");
  if (!header) {
    return false;
  }

  const expected = `Bearer ${secret}`;
  return header === expected;
}

export async function GET(request: Request): Promise<Response> {
  if (!isAuthorised(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

  try {
    const data = await loadActiveBl4Codes({ force: true });
    const codes = data.items.map((item) => item.code);
    const newCodes = await diffNew(codes);

    const newItems = data.items.filter((item) => newCodes.includes(item.code));

    if (newItems.length > 0) {
      await notifyNewCodes(newItems);
    }

    await saveSeen(codes);

    return new Response(
      JSON.stringify({
        updatedAt: data.updatedAt,
        count: data.count,
        newCodes,
        notified: newItems.length,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Cron run failed", error);
    return new Response(JSON.stringify({ error: "Cron failed" }), {
      status: 500,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
}
