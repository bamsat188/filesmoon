export async function onRequest({ request, env, ctx }) {
  // ============================
  // 1️⃣ DOMAIN WHITELIST
  // ============================
  const ALLOWED_DOMAINS = ["play.filesmoon.site"];
  const origin = request.headers.get("Origin") || "";
  const referer = request.headers.get("Referer") || "";

  const allowed = ALLOWED_DOMAINS.some(d => origin.includes(d) || referer.includes(d));
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }

  // ============================
  // 2️⃣ CACHE
  // ============================
  const cache = caches.default;
  const cacheKey = new Request("https://play.filesmoon.site/api/videos"); // statik agar cache konsisten
  let response = await cache.match(cacheKey);

  if (response) {
    return response; // return dari cache jika ada
  }

  // ============================
  // 3️⃣ FETCH DARI API FILEMOON
  // ============================
  const res = await fetch("https://zone.filesmoon.site/videos", {
    headers: { "X-INTERNAL-TOKEN": "pages_internal_ok" }
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Upstream API error", status: res.status }), {
      status: res.status,
      headers: { "Content-Type": "application/json" }
    });
  }

  const data = await res.text();

  // ============================
  // 4️⃣ BUAT RESPONSE + CACHE
  // ============================
  response = new Response(data, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=43200", // 12 jam
      "Access-Control-Allow-Origin": origin || referer || "*",
      "Vary": "Origin",
      "X-Content-Type-Options": "nosniff"
    }
  });

  // simpan ke cache Cloudflare secara async
  ctx.waitUntil(cache.put(cacheKey, response.clone()));

  // ============================
  // 5️⃣ RETURN RESPONSE
  // ============================
  return response;
}
