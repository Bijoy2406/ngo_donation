import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[#f7f2eb] flex items-center justify-center px-4">
      <div className="bg-white rounded-[16px] shadow-xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v4m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 mb-6">You cancelled the payment. No amount was charged.</p>
        <Link
          href="/"
          className="inline-block w-full py-3 rounded-[8px] bg-sage-600 text-white text-sm font-bold hover:bg-sage-700 transition-colors mb-3"
        >
          Try Again
        </Link>
        <Link href="/" className="block text-sm text-sage-500 hover:text-sage-700 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
