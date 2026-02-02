export async function onRequest({ request }) {

  // 🔒 DOMAIN YANG DIIZINKAN
  const ALLOWED_DOMAINS = [
    "play.filesmoon.site",
    // tambahkan domain kamu kalau pakai custom domain
  // "play.filesmoon.site"
  ]

  const origin = request.headers.get("Origin") || ""
  const referer = request.headers.get("Referer") || ""

  const allowed = ALLOWED_DOMAINS.some(d =>
    origin.includes(d) || referer.includes(d)
  )

  // ❌ BLOCK JIKA BUKAN DARI DOMAIN SENDIRI
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Forbidden" }),
      { status: 403 }
    )
  }

  // ✅ LANJUT KE ZONE
  const res = await fetch(
    "https://zone.filesmoon.site/videos",
    {
      headers: {
        "X-INTERNAL-TOKEN": "pages_internal_ok"
      }
    }
  )

  if (!res.ok) {
    return new Response(
      JSON.stringify({
        error: "Upstream API error",
        status: res.status
      }),
      { status: res.status }
    )
  }

  const data = await res.text()

  return new Response(data, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60"
    }
  })
}
