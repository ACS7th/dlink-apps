"use client";

import SearchCategory from "@/components/searchcategory/searchCategory";
import filterData from "./filterData";

export default function CategoryPage({ params, searchParams }) {
  const { category } = params;
  const subcategory = searchParams.subcategory;

  return (
    <SearchCategory
      title="wine"
      filters={filterData[category]}
      category={category}
      subcategory={subcategory}
    />
  );
}
