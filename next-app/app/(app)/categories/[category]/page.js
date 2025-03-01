"use client";

import SearchCategory from "@/components/searchcategory/searchCategory";
import filterData from "../data/filterData";
import { useEffect } from "react";

// export default function WinePage({ params, searchParams }) {

//   const { category } = params;
//   const subcategory = searchParams?.subcategory;
//   const convertCate = {wine: "와인", yangju: "양주"}

//   return (
//     <SearchCategory
//       title={convertCate[category]}
//       filters={filterData[category]}
//       category={category}
//       subcategory={subcategory}
//     />
//   );
// }

export default function Page({ params, searchParams }) {
  const { category } = params;
  const subcategory = searchParams?.subcategory; // URL에서 서브카테고리 가져오기

  const convertCate = { wine: "와인", yangju: "양주" };

  return (
    <SearchCategory
      title={convertCate[category] || category}
      filters={filterData[category]} // 필터 데이터 전달
      category={category}
      subcategory={subcategory} // 서브카테고리 전달
    />
  );
}

