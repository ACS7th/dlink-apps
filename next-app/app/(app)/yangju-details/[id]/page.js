"use client";

import { useParams } from "next/navigation";
import ProductInfo from "@/components/productinfo/productinfo";
import ReviewList from "@/components/reviewlist/reviewlist";

export default function DetailsPage() {
  const { id } = useParams();

  return (
    <div className="p-4 space-y-4">
      <ProductInfo />
      <ReviewList />
    </div>
  );
}
