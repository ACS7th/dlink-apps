"use client";

import { useParams } from "next/navigation";
import WineProductInfo from "@/components/productinfo/wine-productinfo";
import WineTabs from "@/components/tabs/WineTabs";

export default function DetailsPage() {
  const { id } = useParams();

  return (
    <div className="p-4 space-y-4">
      <WineProductInfo />
      <WineTabs />
    </div>
  );
}
