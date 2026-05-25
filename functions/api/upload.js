export async function onRequestPost(context) {

  const { request, env } = context;

  const formData = await request.formData();

  const file = formData.get("file");

  if (!file) {
    return new Response("No file uploaded", {
      status: 400
    });
  }

  const fileName =
    Date.now() + "-" + file.name;

  console.log("Uploading:", fileName);

  await env.IMAGES.put(
    fileName,
    file.stream(),
    {
      httpMetadata: {
        contentType: file.type
      }
    }
  );

  return Response.json({
    success: true,
    fileName,
    url:
      `https://thaiimg.com/uploads/${fileName}`
  });
}