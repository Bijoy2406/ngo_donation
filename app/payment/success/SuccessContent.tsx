"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessContent() {
  const params = useSearchParams();
  const tran_id = params.get("tran_id");
  const amount = params.get("amount");

  return (
    <div className="bg-white rounded-[16px] shadow-xl max-w-md w-full p-8 text-center">
      <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-sage-900 mb-2">Thank You!</h1>
      <p className="text-sage-600 mb-6">Your donation has been received. May your generosity create lasting change.</p>

      {(tran_id || amount) && (
        <div className="bg-sage-50 rounded-[8px] p-4 mb-6 text-left space-y-2">
          {amount && (
            <div className="flex justify-between text-sm">
              <span className="text-sage-500">Amount</span>
              <span className="font-semibold text-sage-900">৳{Number(amount).toLocaleString()}</span>
            </div>
          )}
          {tran_id && (
            <div className="flex justify-between text-sm">
              <span className="text-sage-500">Transaction ID</span>
              <span className="font-mono font-semibold text-sage-900 text-xs">{tran_id}</span>
            </div>
          )}
        </div>
      )}

      <Link
        href="/"
        className="inline-block w-full py-3 rounded-[8px] bg-sage-600 text-white text-sm font-bold hover:bg-sage-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
