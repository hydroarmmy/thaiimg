export async function onRequest(context) {

  const { env, params } = context;

  const key = params.path.join("/");

  const object = await env.IMAGES.get(key);

  if (!object) {
    return new Response("File not found", {
      status: 404
    });
  }

  return new Response(object.body, {
    headers: {
      "Content-Type":
        object.httpMetadata?.contentType ||
        "application/octet-stream"
    }
  });
}