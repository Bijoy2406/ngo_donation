declare module "sslcommerz-lts" {
  interface SSLCommerzData {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url?: string;
    shipping_method: string;
    product_name: string;
    product_category: string;
    product_profile: string;
    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_city: string;
    cus_country: string;
    cus_phone: string;
    value_a?: string;
    [key: string]: unknown;
  }

  interface SSLCommerzResponse {
    GatewayPageURL?: string;
    status?: string;
    risk_level?: string;
    [key: string]: unknown;
  }

  class SSLCommerzPayment {
    constructor(store_id: string, store_passwd: string, is_live: boolean);
    init(data: SSLCommerzData): Promise<SSLCommerzResponse>;
    validate(data: { val_id: string }): Promise<SSLCommerzResponse>;
  }

  export default SSLCommerzPayment;
}
