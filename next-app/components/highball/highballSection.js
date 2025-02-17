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

export default function HighballSection() {
  const { data: session, status } = useSession({ required: true });
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  // 레시피 목록 state 및 필터 state
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState("추천순");

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
        engName: formData.get("engName"),
        korName: formData.get("korName"),
        category,
        making: formData.get("making"),
        ingredientsJSON: formData.get("ingredientsJSON"),
      });

      const res = await fetch(
        `/api/v1/highball/recipes-post?${queryParams.toString()}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) throw new Error("레시피 생성에 실패했습니다.");

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
        const res = await fetch(`/api/v1/highball/recipe/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("삭제 실패");
        setRecipes((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("레시피 삭제 오류:", error);
      }
    }
  };

  if (status === "loading") {
    return <Spinner className="flex mt-4" />;
  }

  return (
    <div className="w-full max-w-full mx-auto p-4 md:p-6">
      {/* 헤더 */}
      <h1 className="text-2xl font-bold text-[#6F0029] mb-1">하이볼 레시피</h1>
      <div className="h-[3px] bg-[#6F0029] mb-4" />

      {/* 필터 & 등록 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <button
          className="inline-flex items-center space-x-1 text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50"
          onClick={() => setFilter(filter === "추천순" ? "최신순" : "추천순")}
        >
          <span>{filter}</span>
        </button>
        <Button
          onPress={onOpen}
          className="inline-flex items-center space-x-1 text-sm text-white bg-[#6F0029] px-3 py-1.5 rounded hover:bg-[#8F0033]"
        >
          레시피 작성
        </Button>
      </div>

      {/* 레시피 목록 */}
      {recipes.map((item) => (
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
