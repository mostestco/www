export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.mostest.com") {
      url.hostname = "mostest.com";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
