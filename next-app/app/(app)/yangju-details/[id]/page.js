"use client";

import { useParams } from "next/navigation";
import YangjuProductInfo from "@/components/productinfo/yangju-productinfo";
import YangjuTabs from "@/components/tabs/yangjuTabs";

export default function DetailsPage() {
  const { id } = useParams();

  return (
    <div className="p-4 space-y-4">
      <YangjuProductInfo />
      {/* <YangjuTabs /> */}
    </div>
  );
}
