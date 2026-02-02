export async function onRequest(context) {
  const { request } = context;

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");

    const API_KEY = "107242cw1es4xgd2p0u04j";
    const API_URL = `https://filemoonapi.com/api/file/list?key=${API_KEY}&page=${page}`;

    const res = await fetch(API_URL);
    const json = await res.json();

    const videos =
      json?.result?.files ||
      json?.files ||
      [];

    return new Response(JSON.stringify(videos), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=43200"
      }
    });

  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Function error", message: e.message }),
      { status: 500 }
    );
  }
}
