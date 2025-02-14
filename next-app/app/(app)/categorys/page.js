"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterSection from "@/components/FilterSection";

const categoryData = {
  wine: {
    title: "Wine",
    category: "wine",
    items: [
      { id: 1, name: "와인 1", image: "/images/wine1.png" },
      { id: 2, name: "와인 2", image: "/images/wine2.png" },
      { id: 3, name: "와인 3", image: "/images/wine3.png" },
      { id: 4, name: "와인 4", image: "/images/wine4.png" },
    ],
  },
  whiskey: {
    title: "Whiskey",
    category: "whiskey",
    items: [
      { id: 1, name: "위스키 1", image: "/images/whiskey1.png" },
      { id: 2, name: "위스키 2", image: "/images/whiskey2.png" },
      { id: 3, name: "위스키 3", image: "/images/whiskey3.png" },
      { id: 4, name: "위스키 4", image: "/images/whiskey4.png" },
    ],
  },
};

export default function CategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (filter && (categoryData.wine.items.some(item => item.name === filter) || categoryData.whiskey.items.some(item => item.name === filter))) {
      const category = categoryData.wine.items.some(item => item.name === filter) ? "wine" : "whiskey";
      setSelectedCategory(category);
    }
  }, [filter]);

  if (!selectedCategory) {
    return <div className="text-center text-lg font-bold mt-10">카테고리를 선택해주세요.</div>;
  }

  return (
    <FilterSection
      title={categoryData[selectedCategory].title}
      category={categoryData[selectedCategory].category}
      items={categoryData[selectedCategory].items}
      defaultFilter={filter}
    />
  );
}
