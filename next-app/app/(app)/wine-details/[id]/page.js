"use client";

import { useParams } from "next/navigation";
import WineProductInfo from "@/components/productinfo/wine-productinfo";
import WineReviewList from "@/components/reviewlist/wine-reviewlist";

export default function DetailsPage() {
  const { id } = useParams();

  return (
    <div className="p-4 space-y-4">
      <WineProductInfo />
      <WineReviewList />
    </div>
  );
}
