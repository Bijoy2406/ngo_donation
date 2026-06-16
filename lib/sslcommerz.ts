const IS_LIVE = process.env.SSLCOMMERZ_IS_LIVE === "true";

export const SSLCOMMERZ_INIT_URL = IS_LIVE
  ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
  : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

export const SSLCOMMERZ_VALIDATE_URL = IS_LIVE
  ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
  : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

export const STORE_ID = process.env.SSLCOMMERZ_STORE_ID!;
export const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD!;

export async function validatePayment(val_id: string) {
  const url = new URL(SSLCOMMERZ_VALIDATE_URL);
  url.searchParams.set("val_id", val_id);
  url.searchParams.set("store_id", STORE_ID);
  url.searchParams.set("store_passwd", STORE_PASSWORD);
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString());
  return res.json() as Promise<{ status: string; risk_level?: string; tran_id?: string }>;
}
