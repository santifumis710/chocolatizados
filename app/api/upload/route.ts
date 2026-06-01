import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Formato no permitido. Usá JPG, PNG o WebP." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "La imagen no puede superar 5 MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const filename = `products/${Date.now()}.${ext}`;

  const blob = await put(filename, file, { access: "public" });

  return NextResponse.json({ url: blob.url });
}
