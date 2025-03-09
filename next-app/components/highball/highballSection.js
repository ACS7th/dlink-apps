"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button, useDisclosure } from "@heroui/react";
import { Modal, ModalContent } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { useSearchParams } from "next/navigation";
import RecipeCard from "@/components/highball/recipeCard";
import RecipeForm from "@/components/highball/recipeForm";
import FilterDropdown from "@/components/dropdown/filterDropdown";

export const dynamic = "force-dynamic";

export default function HighballSection() {
  const { data: session, status } = useSession();
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const category = searchParams.get("subcategory");
  const highballId = searchParams.get("highballId");

  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState("최신순");

  // 등록 모달 제어 (FormData 방식 사용)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 레시피 목록에서 특정 항목을 찾기 위한 Ref
  const recipeRefs = useRef(new Map());

  // ✅ 특정 highballId가 있다면 해당 RecipeCard로 스크롤
  useEffect(() => {
    if (highballId && recipeRefs.current.has(highballId)) {
      const targetCard = recipeRefs.current.get(highballId);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [recipes, highballId]);

  // 레시피 목록 불러오기
  const fetchRecipes = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/highball/category?category=${category}`);
      if (!res.ok) throw new Error("레시피 목록을 불러오지 못했습니다.");
      const data = await res.json();
      setRecipes(data);
    } catch (error) {
      console.error(error);
    }
  }, [category]);

  useEffect(() => {
    if (category) fetchRecipes();
  }, [category, fetchRecipes]);

  const sortedRecipes = [...recipes].sort((a, b) => {
    if (filter === "추천순") return b.likeCount - a.likeCount;
    else if (filter === "최신순") return new Date(b.createdAt) - new Date(a.createdAt);
    else return 0;
  });

  const sortOptions = [
    { value: "추천순", label: "추천순" },
    { value: "최신순", label: "최신순" },
  ];

  if (status === "loading") return <Spinner className="flex mt-5" />;

  return (
    <div className="w-full max-w-full mx-auto p-3 md:p-6">
      <h1 className="text-2xl font-bold text-primary mb-1">하이볼 레시피</h1>
      <div className="h-[3px] bg-[#6F0029] mb-4" />

      <div className="flex justify-between items-center mb-4">
        <FilterDropdown
          title="정렬 옵션"
          options={sortOptions}
          selectedOption={filter}
          onOptionChange={setFilter}
          className="mr-2"
        />
        <Button
          onPress={onOpen}
          className="inline-flex items-center space-x-1 text-sm text-white bg-[#6F0029] px-3 py-1.5 rounded hover:bg-[#8F0033]"
          isDisabled={status !== "authenticated"}
        >
          레시피 작성
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedRecipes.map((item) => (
          <RecipeCard
            key={item.id}
            ref={(el) => el && recipeRefs.current.set(item.id, el)} 
            item={item}
            session={session}
            resolvedTheme={resolvedTheme}
          />
        ))}
      </div>
    </div>
  );
}
