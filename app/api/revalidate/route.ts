import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid or missing secret" }, { status: 401 });
  }

  let body: { _type?: string } = {};
  try {
    body = await request.json();
  } catch {
    // ignore parse errors
  }

  const type = body._type;

  switch (type) {
    case "event":
      revalidatePath("/events");
      revalidatePath("/events/[slug]", "page");
      revalidatePath("/");
      break;
    case "teamMember":
      revalidatePath("/team");
      break;
    case "siteSettings":
    case "carouselItem":
    case "missionSection":
    case "impactItem":
    case "faqItem":
    case "donationSettings":
      revalidatePath("/");
      break;
    default:
      revalidatePath("/");
      revalidatePath("/events");
      revalidatePath("/team");
  }

  return NextResponse.json({ revalidated: true, type });
}
