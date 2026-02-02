export async function onRequest({ request }) {
  const ALLOWED_DOMAINS = [
    "filesmoon.pages.dev",
    "play.filesmoon.site",
  ]

  const origin = request.headers.get("Origin") || ""
  const referer = request.headers.get("Referer") || ""

  const allowed = ALLOWED_DOMAINS.some(d =>
    origin.includes(d) || referer.includes(d)
  )

  // Handle preflight CORS request
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400"
      }
    })
  }

  // Block request jika ada Origin/Referer tapi bukan allowed
  if ((origin || referer) && !allowed) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 })
  }

  try {
    const res = await fetch("https://zone.filesmoon.site/videos", {
      headers: { "X-INTERNAL-TOKEN": "pages_internal_ok" }
    })

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Upstream API error", status: res.status }),
        { status: res.status }
      )
    }

    const data = await res.text()

    return new Response(data, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "*"
      }
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", detail: err.message }),
      { status: 500 }
    )
  }
}
