import { NextResponse } from "next/server";

let ads: {
  _id: string;
  images: string[];
  place: string;
  link?: string;
}[] = [
  { _id: "1", images: ["/ads/ad1.jpg"], place: "news", link: "" }
];

export async function GET() {
  return NextResponse.json(ads);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newAd = {
    _id: Date.now().toString(),
    images: body.images || [],
    place: body.place || "news",
    link: body.link || ""
  };
  ads.push(newAd);
  return NextResponse.json(newAd, { status: 201 });
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const body = await req.json();
  const idx = ads.findIndex(ad => ad._id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  ads[idx] = { ...ads[idx], ...body };
  return NextResponse.json(ads[idx]);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  ads = ads.filter(ad => ad._id !== id);
  return NextResponse.json({ success: true });
}