import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const ALL_TAGS = [
  "siteSettings",
  "events",
  "team",
  "carousel",
  "mission",
  "impact",
  "faq",
  "donation",
];

function revalidateAllTags() {
  for (const tag of ALL_TAGS) {
    revalidateTag(tag);
  }
}

function revalidateSiteWide() {
  revalidateAllTags();
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
      revalidateTag("events");
      revalidatePath("/events", "page");
      revalidatePath("/events/[slug]", "page");
      revalidatePath("/", "page");
      break;
    case "teamMember":
      revalidateTag("team");
      revalidatePath("/team", "page");
      break;
    case "siteSettings":
      revalidateTag("siteSettings");
      revalidateSiteWide();
      break;
    case "carouselItem":
      revalidateTag("carousel");
      revalidatePath("/", "page");
      break;
    case "missionSection":
      revalidateTag("mission");
      revalidatePath("/", "page");
      break;
    case "impactItem":
      revalidateTag("impact");
      revalidatePath("/", "page");
      break;
    case "faqItem":
      revalidateTag("faq");
      revalidatePath("/", "page");
      break;
    case "donationSettings":
      revalidateTag("donation");
      revalidatePath("/", "layout");
      break;
    default:
      revalidateSiteWide();
  }

  return NextResponse.json({ revalidated: true, type });
}
