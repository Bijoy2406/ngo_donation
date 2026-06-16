import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const tran_id = formData.get("tran_id") as string | null;
  console.log(`[SSLCommerz] Payment cancelled — tran_id: ${tran_id ?? "unknown"}`);
  return NextResponse.redirect(
    new URL("/payment/cancel", process.env.NEXT_PUBLIC_SITE_URL!)
  );
}
