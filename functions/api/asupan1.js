export async function onRequest() {
  try {
    const res = await fetch("https://zone.filesmoon.site/videos", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        // 🔑 WAJIB – ini kunci lolos whitelist
        "X-Internal-Token": "pages_internal_ok"
      }
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Upstream API error", status: res.status }),
        { status: 500 }
      );
    }

    const json = await res.json();

    const files = (json.result?.files || [])
      .filter(v => v.fld_id === 354980)
      .map(v => ({
        file_code: v.file_code,
        title: v.title,
        thumb: v.thumbnail,
        uploaded: v.uploaded
      }));

    return new Response(
      JSON.stringify({ files }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Server exception", message: e.message }),
      { status: 500 }
    );
  }
}
