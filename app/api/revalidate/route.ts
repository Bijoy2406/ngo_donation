import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

function revalidateSiteWide() {
  // Revalidate layout-driven data plus key pages that depend on Sanity content.
  revalidatePath("/", "layout");
  revalidatePath("/", "page");
  revalidatePath("/events", "page");
  revalidatePath("/events/[slug]", "page");
  revalidatePath("/team", "page");
  revalidatePath("/contact", "page");
}

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
      revalidatePath("/events", "page");
      revalidatePath("/events/[slug]", "page");
      revalidatePath("/", "page");
      break;
    case "teamMember":
      revalidatePath("/team", "page");
      break;
    case "siteSettings":
    case "carouselItem":
    case "missionSection":
    case "impactItem":
    case "faqItem":
    case "donationSettings":
      revalidateSiteWide();
      break;
    default:
      revalidateSiteWide();
  }

  return NextResponse.json({ revalidated: true, type });
}
