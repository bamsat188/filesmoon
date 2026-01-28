export default {
  async fetch(request) {
    const url = new URL(request.url)

    // handle hanya ads
    if (url.hostname === "ads.filesmoon.site" && url.pathname === "/go") {
      return Response.redirect(
        "https://TARGET-ADS-KAMU.com",
        302
      )
    }

    return new Response("Not Found", { status: 404 })
  }
}
