"use client";

import { useParams } from "next/navigation";
import YangjuProductInfo from "@/components/productinfo/yangju-productinfo";
import YangjuReviewList from "@/components/reviewlist/yangju-reviewlist";

export default function DetailsPage() {
  const { id } = useParams();

  return (
    <div className="p-4 space-y-4">
      <YangjuProductInfo />
      <YangjuReviewList />
    </div>
  );
}
