import { NextRequest, NextResponse } from "next/server";

const STORE_ID = process.env.SSLCOMMERZ_STORE_ID!;
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD!;
const IS_LIVE = process.env.SSLCOMMERZ_IS_LIVE === "true";

const SSLCOMMERZ_INIT_URL = IS_LIVE
  ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
  : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, name, email, phone, address, returnUrl } = body;

    if (!amount || !name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 10) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const tran_id = `DON-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    // Callbacks must be reachable by SSLCommerz servers (ngrok in dev, real domain in prod)
    const callbackUrl = process.env.SSLCOMMERZ_CALLBACK_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const params = new URLSearchParams({
      store_id: STORE_ID,
      store_passwd: STORE_PASSWORD,
      total_amount: parsedAmount.toString(),
      currency: "BDT",
      tran_id,
      success_url: `${callbackUrl}/api/payment/success`,
      fail_url: `${callbackUrl}/api/payment/fail`,
      cancel_url: `${callbackUrl}/api/payment/cancel`,
      ipn_url: `${callbackUrl}/api/payment/ipn`,
      shipping_method: "NO",
      product_name: "Donation",
      product_category: "donation",
      product_profile: "non-physical-goods",
      cus_name: name,
      cus_email: email,
      cus_add1: address || "N/A",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: phone,
      ship_name: name,
      ship_add1: "N/A",
      ship_city: "Dhaka",
      ship_country: "Bangladesh",
      value_a: tran_id,
      value_b: returnUrl || "/",
    });

    const response = await fetch(SSLCOMMERZ_INIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const apiResponse = await response.json();

    if (apiResponse?.GatewayPageURL) {
      return NextResponse.json({ url: apiResponse.GatewayPageURL, tran_id });
    }

    console.error("SSLCommerz init failed:", apiResponse);
    return NextResponse.json(
      { error: apiResponse?.failedreason || "Payment gateway error" },
      { status: 502 }
    );
  } catch (err) {
    console.error("Payment initiate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
