export async function onRequest() {
  try {
    // Ambil API Filemoon asli
    const res = await fetch("https://zone.filesmoon.site/videos", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Upstream API error" }),
        { status: 500 }
      );
    }

    const json = await res.json();

    // Filter folder (fld_id kamu)
    const files = (json.result?.files || [])
      .filter(v => v.fld_id === 354980)
      .map(v => ({
        file_code: v.file_code,          // supaya cocok dengan index.html kamu
        title: v.title,
        thumb: v.thumbnail,
        uploaded: v.uploaded
      }));

    return new Response(
      JSON.stringify({ files }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error", detail: err.message }),
      { status: 500 }
    );
  }
}
