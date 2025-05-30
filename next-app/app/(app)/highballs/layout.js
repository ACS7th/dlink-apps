"use client";
import { Spinner } from "@heroui/react";
import { Suspense } from "react";


export default function Layout({ children }) {
  return (
    <Suspense fallback={<Spinner size="lg" color="primary" />}>
      {children}
    </Suspense>
  );
}
