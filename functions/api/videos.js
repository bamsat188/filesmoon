export async function onRequest({ request, env, ctx }) {
  // 🔒 DOMAIN YANG DIIZINKAN
  const ALLOWED_DOMAINS = ["play.filesmoon.site"];
  const origin = request.headers.get("Origin") || "";
  const referer = request.headers.get("Referer") || "";

  if (!ALLOWED_DOMAINS.some(d => origin.includes(d) || referer.includes(d))) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  let response = await cache.match(cacheKey);

  if (!response) {
    // ambil data dari API utama
    const res = await fetch("https://zone.filesmoon.site/videos", {
      headers: { "X-INTERNAL-TOKEN": "pages_internal_ok" }
    });

    const data = await res.text();

    response = new Response(data, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=43200" // 12 jam
      }
    });

    // simpan ke cache Cloudflare
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  }

  return response;
}
