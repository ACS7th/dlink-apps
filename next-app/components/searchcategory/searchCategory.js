import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@heroui/react";

const subcategoryToType = {
  Gin: "진",
  Rum: "럼",
  Vodka: "보드카",
  Brandy: "브랜디",
  Liqueur: "리큐어",
  Whiskey: "위스키",
  Tequila: "데킬라",
};

export default function SearchCategory({
  title,
  filters,
  category,
  subcategory: propSubcategory,
}) {
  const searchParams = useSearchParams();
  const subcategory = propSubcategory || searchParams.get("subcategory");
  
  // filters를 useMemo로 감싸서 참조가 변경되지 않도록 함
  const validCategoryFilters = useMemo(() => filters || {}, [filters]);

  const translatedSubcategory = subcategory ? subcategoryToType[subcategory] : null;

  // useCallback으로 getInitialFilters를 정의
  const getInitialFilters = useCallback(() => {
    const initialFilters = Object.keys(validCategoryFilters).reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {}
    );

    if (
      category === "양주" &&
      translatedSubcategory &&
      validCategoryFilters.type?.includes(translatedSubcategory)
    ) {
      initialFilters.type = [translatedSubcategory];
    }

    return initialFilters;
  }, [validCategoryFilters, category, translatedSubcategory]);

  const [selectedFilters, setSelectedFilters] = useState(getInitialFilters);

  useEffect(() => {
    setSelectedFilters(getInitialFilters());
  }, [getInitialFilters]);

  // 양주 서브카테고리 자동 적용
  useEffect(() => {
    if (
      category === "양주" &&
      translatedSubcategory &&
      validCategoryFilters.type?.includes(translatedSubcategory)
    ) {
      setSelectedFilters((prev) => {
        if (!prev.type.includes(translatedSubcategory)) {
          return { ...prev, type: [...prev.type, translatedSubcategory] };
        }
        return prev;
      });
    }
  }, [translatedSubcategory, category, validCategoryFilters.type]);

  // 필터 토글 함수
  const toggleFilter = (filterCategory, value) => {
    setSelectedFilters((prev) => {
      const updatedCategory = prev[filterCategory]?.includes(value)
        ? prev[filterCategory].filter((item) => item !== value)
        : [...prev[filterCategory], value];

      return { ...prev, [filterCategory]: updatedCategory };
    });
  };

  return (
    <div className="w-full max-w-full mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-[#6F0029] mb-1">{title}</h1>
      <div className="h-[3px] bg-[#6F0029] mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {Object.entries(validCategoryFilters).map(([filterCategory, options]) => (
          <div key={filterCategory} className="bg-gray-100 p-2 rounded">
            <h3 className="text-md font-bold mb-2">{filterCategory}</h3>
            <div className="grid grid-cols-2 gap-1">
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
    </div>
  );
}
