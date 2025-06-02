export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, data } = body;

  if (!name || !data) {
    throw createError({ statusCode: 400, message: "Missing name or data" });
  }

  const base64Data = data.split(",")[1];
  const buffer = Buffer.from(base64Data, "base64");

  // Use the "public" storage driver that points to ./public
  const storage = useStorage("public");

  // Save under public/uploads/filename.ext
  await storage.setItemRaw(`uploads/${name}`, buffer);

  return {
    message: "Image uploaded successfully",
    path: `/uploads/${name}`, // Public URL
  };
});
