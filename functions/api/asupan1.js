export async function onRequest() {

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
