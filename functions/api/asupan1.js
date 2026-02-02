export async function onRequest({ request }) {
  // 🔒 DOMAIN YANG DIIZINKAN
  const ALLOWED_DOMAINS = [
    "filesmoon.pages.dev",
    "play.filesmoon.site"
  ]

  const origin = request.headers.get("Origin") || ""
  const referer = request.headers.get("Referer") || ""

  // ✅ Cek apakah request datang dari domain yang diizinkan
  let allowed = false
  if (origin || referer) {
    allowed = ALLOWED_DOMAINS.some(d =>
      origin.includes(d) || referer.includes(d)
    )
  }

  // ❌ BLOCK jika ada Origin/Referer tapi bukan domain sendiri
  if ((origin || referer) && !allowed) {
    return new Response(
      JSON.stringify({ error: "Forbidden" }),
      { status: 403 }
    )
  }

  // ✅ LANJUT KE ZONE
  try {
    const res = await fetch("https://zone.filesmoon.site/videos", {
      headers: {
        "X-INTERNAL-TOKEN": "pages_internal_ok"
      }
    })

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
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", detail: err.message }),
      { status: 500 }
    )
  }
}
