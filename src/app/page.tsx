"use client";

import { SwapForm } from "@/components/swap-form";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <SwapForm />
      </div>
    </div>
  );
}
