"use client";

import { useSearchParams } from "next/navigation";
import SearchCategory from "@/components/searchcategory/searchCategory";

export const filterData = {
  wine: {
    price: ["~5", "6~15", "16~50", "50~200+"],
    alcohol: ["~10", "11~14", "15~22"],
    volume: ["375", "750", "1500", "3000"],
    type: ["레드", "화이트", "로제", "스파클링"],
  },
  whiskey: {
    price: ["~10", "10~30", "30~100", "100+"],
    alcohol: ["40~45", "46~50", "50+"],
    volume: ["~700", "700~1000", "1000+"],
    type: ["진", "데킬라", "보드카", "럼", "리큐어", "위스키", "브랜디"],
  },
};

export default function CategoryPage({ params }) {
  const { category } = params;
  const searchParams = useSearchParams();
  const subcategory = searchParams.get("subcategory");

  return (
    <SearchCategory
      title={"wine"}
      filters={filterData[category]}
      category={category}
      subcategory={subcategory}
    />
  );
}
