import { NextRequest, NextResponse } from "next/server";
import { validatePayment } from "@/lib/sslcommerz";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const val_id = formData.get("val_id") as string;
    const tran_id = formData.get("tran_id") as string;
    const amount = formData.get("amount") as string;
    const status = formData.get("status") as string;
    const returnPath = (formData.get("value_b") as string) || "/";

    if (status !== "VALID" && status !== "VALIDATED") {
      return NextResponse.redirect(new URL("/payment/fail?reason=invalid_status", siteUrl));
    }

    const validation = await validatePayment(val_id);

    if (validation?.status !== "VALID" && validation?.status !== "VALIDATED") {
      return NextResponse.redirect(new URL("/payment/fail?reason=validation_failed", siteUrl));
    }

    if (validation.risk_level === "1") {
      console.warn(`[SSLCommerz] High risk transaction: ${tran_id}`);
    }

    console.log(`[SSLCommerz] Payment success — tran_id: ${tran_id}, amount: ${amount}`);

    const redirectPath = `${returnPath}?donated=true&tran_id=${encodeURIComponent(tran_id)}&amount=${encodeURIComponent(amount)}`;
    return NextResponse.redirect(new URL(redirectPath, siteUrl));
  } catch (err) {
    console.error("[SSLCommerz success error]", err);
    return NextResponse.redirect(new URL("/payment/fail?reason=error", siteUrl));
  }
}
