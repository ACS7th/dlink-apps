"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button, useDisclosure } from "@heroui/react";
import { Modal, ModalContent } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { useSearchParams } from "next/navigation";
import RecipeCard from "@/components/highball/recipeCard";
import RecipeForm from "@/components/highball/recipeForm";
import FilterDropdown from "@/components/dropdown/filterDropdown";

export default function HighballSection() {
  const { data: session, status } = useSession({ required: true });
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  // 레시피 목록 state 및 정렬 옵션 state
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState("최신순");

  // 모달 제어 (HeroUI Modal)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 레시피 목록 불러오기
  const fetchRecipes = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/highball/category?category=" + category);
      if (!res.ok) {
        throw new Error("레시피 목록을 불러오지 못했습니다.");
      }
      const data = await res.json();
      setRecipes(data);
    } catch (error) {
      console.error(error);
    }
  }, [category]);

  useEffect(() => {
    if (category) {
      fetchRecipes();
    }
  }, [category, fetchRecipes]);

  // 레시피 등록 처리 (RecipeForm에서 사용)
  const handleSubmitRecipe = async (formData, onClose) => {
    try {
      // queryParams 생성 (userId는 세션에서 가져옴)
      const queryParams = new URLSearchParams({
        userId: session?.user?.id,
        Name: formData.get("name"),
        category,
        making: formData.get("making"),
        ingredientsJSON: formData.get("ingredientsJSON"),
      });

      const url = `/api/v1/highball/recipes-post?${queryParams.toString()}`;
      console.log("레시피 등록 API 요청 URL:", url);

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      console.log("레시피 등록 API 응답:", res);

      if (!res.ok) throw new Error("레시피 생성에 실패했습니다.");

      const data = await res.json();
      console.log("레시피 등록 API 응답 데이터:", data);

      onClose();
      fetchRecipes(); // 등록 후 리스트 새로고침
    } catch (error) {
      console.error("레시피 생성 에러:", error);
    }
  };

  // 레시피 삭제 처리
  const handleDeleteRecipe = async (id, recipeWriteUser) => {
    if (recipeWriteUser === session?.user?.id) {
      try {
        const url = `/api/v1/highball/recipe/${id}`;
        console.log("레시피 삭제 API 요청 URL:", url);
        const res = await fetch(url, { method: "DELETE" });
        console.log("레시피 삭제 API 응답:", res);
        if (!res.ok) throw new Error("삭제 실패");
        // DB 스키마에서는 id 대신 _id일 수도 있음. 필요한 경우 item._id 사용.
        setRecipes((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("레시피 삭제 오류:", error);
      }
    } else {
      console.error("삭제 권한이 없습니다.");
    }
  };

  // 정렬된 레시피 배열 계산 (정렬 옵션에 따라)
  const sortedRecipes = [...recipes].sort((a, b) => {
    if (filter === "추천순") {
      // 좋아요 수 내림차순 (높은 좋아요 수가 먼저 나오도록)
      return b.likeCount - a.likeCount;
    } else if (filter === "최신순") {
      // 등록 시간 내림차순 (최신 레시피가 먼저 나오도록)
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return 0;
    }
  });

  // 정렬 옵션을 위한 옵션 배열
  const sortOptions = [
    { value: "추천순", label: "추천순" },
    { value: "최신순", label: "최신순" },
  ];

  if (status === "loading") {
    return <Spinner className="flex mt-4" />;
  }

  return (
    <div className="w-full max-w-full mx-auto p-4 md:p-6">
      {/* 헤더 */}
      <h1 className="text-2xl font-bold text-[#6F0029] mb-1">하이볼 레시피</h1>
      <div className="h-[3px] bg-[#6F0029] mb-4" />

      {/* 정렬 옵션 및 등록 버튼 */}
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
        >
          레시피 작성
        </Button>
      </div>

      {/* 레시피 목록 */}
      {sortedRecipes.map((item) => (
        <RecipeCard
          key={item.id}
          item={item}
          session={session}
          resolvedTheme={resolvedTheme}
          onDelete={handleDeleteRecipe}
        />
      ))}

      {/* 레시피 등록 모달 */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="auto" className="mx-4">
        <ModalContent>
          {(onClose) => (
            <RecipeForm onClose={onClose} onSubmit={handleSubmitRecipe} />
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}