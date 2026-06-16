import { NextRequest, NextResponse } from "next/server";
import { validatePayment } from "@/lib/sslcommerz";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const val_id = formData.get("val_id") as string;
    const tran_id = formData.get("tran_id") as string;
    const amount = formData.get("amount") as string;
    const status = formData.get("status") as string;

    if (status !== "VALID" && status !== "VALIDATED") {
      console.warn(`[SSLCommerz IPN] Non-valid status: ${status} for tran_id: ${tran_id}`);
      return NextResponse.json({ received: true });
    }

    const validation = await validatePayment(val_id);

    if (validation?.status === "VALID" || validation?.status === "VALIDATED") {
      if (validation.risk_level === "1") {
        console.warn(`[SSLCommerz IPN] High risk — tran_id: ${tran_id}`);
      }
      console.log(`[SSLCommerz IPN] Validated — tran_id: ${tran_id}, amount: ${amount}`);
    } else {
      console.error(`[SSLCommerz IPN] Validation failed for tran_id: ${tran_id}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[SSLCommerz IPN error]", err);
    return NextResponse.json({ received: true });
  }
}
