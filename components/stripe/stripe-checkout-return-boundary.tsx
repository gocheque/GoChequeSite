"use client";

import { Suspense } from "react";
import { StripeCheckoutReturn } from "@/components/stripe/stripe-checkout-return";

export function StripeCheckoutReturnBoundary() {
  return (
    <Suspense fallback={null}>
      <StripeCheckoutReturn />
    </Suspense>
  );
}
