import { Spinner } from "@heroui/react";
import { Suspense } from "react";


export default function Layout({ children }) {
  return (
    <Suspense fallback={<div></div>}>
      {children}
    </Suspense>
  );
}
