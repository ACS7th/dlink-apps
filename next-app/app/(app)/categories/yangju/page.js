"use client";

import { useSearchParams } from "next/navigation";
import SearchCategory from "@/components/searchcategory/searchCategory";
import filterData from "../wine/filterData";

export const dynamic = 'force-dynamic';

export default function WhiskeyPage() {

  const searchParams = useSearchParams();
  const subcategory = searchParams.get("subcategory");

  return (
    <SearchCategory
      title="양주"
      filters={filterData.whiskey}
      category="whiskey"
      subcategory={subcategory}
    />
  );
}
