"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@heroui/react";
import WineSearchResultsPage from "../searchresults/wineSearchResults";

// export const dynamic = 'force-dynamic';

// const subcategoryToType = {
//   Gin: "진",
//   Rum: "럼",
//   Vodka: "보드카",
//   Brandy: "브랜디",
//   Liqueur: "리큐어",
//   Whiskey: "위스키",
//   Tequila: "데킬라",
// };

// export default function SearchCategory({
//   title,
//   filters,
//   category,
//   subcategory: propSubcategory,
// }) {
//   const searchParams = useSearchParams();
//   const subcategory = propSubcategory || searchParams.get("subcategory");

//   // filters를 useMemo로 감싸서 참조가 변경되지 않도록 함
//   const validCategoryFilters = useMemo(() => filters || {}, [filters]);

//   const translatedSubcategory = subcategory ? subcategoryToType[subcategory] : null;

//   // useCallback으로 getInitialFilters를 정의
//   const getInitialFilters = useCallback(() => {
//     const initialFilters = Object.keys(validCategoryFilters).reduce(
//       (acc, key) => ({ ...acc, [key]: [] }),
//       {}
//     );

//     if (
//       category === "양주" &&
//       translatedSubcategory &&
//       validCategoryFilters.type?.includes(translatedSubcategory)
//     ) {
//       initialFilters.type = [translatedSubcategory];
//     }

//     return initialFilters;
//   }, [validCategoryFilters, category, translatedSubcategory]);

//   const [selectedFilters, setSelectedFilters] = useState(getInitialFilters);

//   useEffect(() => {
//     setSelectedFilters(getInitialFilters());
//   }, [getInitialFilters]);

//   // 양주 서브카테고리 자동 적용
//   useEffect(() => {
//     if (
//       category === "양주" &&
//       translatedSubcategory &&
//       validCategoryFilters.type?.includes(translatedSubcategory)
//     ) {
//       setSelectedFilters((prev) => {
//         if (!prev.type.includes(translatedSubcategory)) {
//           return { ...prev, type: [...prev.type, translatedSubcategory] };
//         }
//         return prev;
//       });
//     }
//   }, [translatedSubcategory, category, validCategoryFilters.type]);

//   // 필터 토글 함수
//   const toggleFilter = (filterCategory, value) => {
//     setSelectedFilters((prev) => {
//       const updatedCategory = prev[filterCategory]?.includes(value)
//         ? prev[filterCategory].filter((item) => item !== value)
//         : [...prev[filterCategory], value];

//       return { ...prev, [filterCategory]: updatedCategory };
//     });
//   };

//   return (
//     <div className="w-full max-w-full mx-auto p-4 md:p-6">
//       <h1 className="text-2xl font-bold text-primary mb-1">{title}</h1>
//       <div className="h-[3px] bg-primary mb-4" />
//       {category === "yangju" ?
//         <div className="flex flex-col md:flex-row space-x-5">
//           {Object.entries(validCategoryFilters).map(([filterCategory, options]) => (
//             <div key={filterCategory} className="bg-gray-100 p-2 rounded">
//               <h3 className="text-md font-bold mb-2">{filterCategory}</h3>
//               <div className="flex space-x-1">
//                 {options.map((option) => (
//                   <Checkbox
//                     key={option}
//                     checked={selectedFilters[filterCategory]?.includes(option)}
//                     onChange={() => toggleFilter(filterCategory, option)}
//                   >
//                     {option}
//                   </Checkbox>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//         : <WineSearchResultsPage/>}
//     </div>
//   );
// }





// 동적 렌더링이 필요하다면(서버에서 SSR을 강제하고 싶지 않다면) 아래 옵션 사용
export const dynamic = "force-dynamic";

// 영문 subcategory를 한글로 바꿔주는 매핑
const subcategoryToType = {
  Gin: "진",
  Tequila: "데킬라",
  Vodka: "보드카",
  Brandy: "브랜디",
  Liqueur: "리큐어",
  Whiskey: "위스키",
  Rum: "럼",
};

export default function SearchCategory({
  title,             // 예: "양주"
  filters,           // filterData.yangju
  category,          // "yangju"
  subcategory: propSubcategory, // "Gin"
}) {
  // URL 쿼리 파라미터도 가져올 수 있음
  const searchParams = useSearchParams();
  const subcategory = propSubcategory || searchParams.get("subcategory");

  // 필터 데이터가 없을 수도 있으니 방어 코드
  const validCategoryFilters = useMemo(() => filters || {}, [filters]);

  // "Gin" -> "진"
  const translatedSubcategory = subcategory ? subcategoryToType[subcategory] : null;

  /**
   * 초기 필터 상태 만들기
   */
  const getInitialFilters = useCallback(() => {
    // price, alcohol, volume, type 등 키마다 빈 배열을 만든다
    const initialFilters = Object.keys(validCategoryFilters).reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {}
    );

    // category가 "yangju"이고,
    // subcategory가 "Gin" -> "진"이고,
    // filterData.yangju.type 배열에 "진"이 있다면
    // 초기에 type = ["진"]으로 체크
    if (
      category === "yangju" &&
      translatedSubcategory &&
      validCategoryFilters.type?.includes(translatedSubcategory)
    ) {
      initialFilters.type = [translatedSubcategory];
    }

    return initialFilters;
  }, [validCategoryFilters, category, translatedSubcategory]);

  // 필터 체크 상태
  const [selectedFilters, setSelectedFilters] = useState(getInitialFilters);

  // props가 바뀌면 다시 초기화
  useEffect(() => {
    setSelectedFilters(getInitialFilters());
  }, [getInitialFilters]);

  // 만약 페이지 진입 후 동적으로 subcategory를 바꿀 때도 반응하고 싶다면
  // 이미 위의 useEffect로 커버가 되므로 추가로 작성할 필요는 없음

  // 체크박스 토글
  const toggleFilter = (filterCategory, value) => {
    setSelectedFilters((prev) => {
      const alreadySelected = prev[filterCategory]?.includes(value);
      const updatedCategory = alreadySelected
        ? prev[filterCategory].filter((item) => item !== value)
        : [...prev[filterCategory], value];

      return { ...prev, [filterCategory]: updatedCategory };
    });
  };

  return (
    <div className="w-full max-w-full mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-primary mb-1">{title}</h1>
      <div className="h-[3px] bg-primary mb-4" />

      {category === "yangju" ? (
        // 양주 카테고리: 필터 UI 렌더링
        <div className="flex flex-col md:flex-row space-x-5">
          {Object.entries(validCategoryFilters).map(([filterCategory, options]) => (
            <div key={filterCategory} className="bg-gray-100 p-2 rounded mb-4">
              <h3 className="text-md font-bold mb-2">{filterCategory}</h3>
              <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                  <Checkbox
                    key={option}
                    checked={selectedFilters[filterCategory]?.includes(option)}
                    onChange={() => toggleFilter(filterCategory, option)}
                  >
                    {option}
                  </Checkbox>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 와인 등 다른 카테고리면 와인 검색 결과 페이지 (예시)
        <WineSearchResultsPage />
      )}
    </div>
  );
}