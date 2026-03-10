"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProgressBar
        height="3px"
        color="#52796f"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  );
}
