import Link from "next/link";

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen bg-[#f7f2eb] flex items-center justify-center px-4">
      <div className="bg-white rounded-[16px] shadow-xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-6">Something went wrong with your payment. No amount was charged.</p>
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
