import Link from "next/link";
import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f7f2eb] flex items-center justify-center px-4">
      <Suspense fallback={null}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
