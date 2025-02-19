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
  const { data: session, status } = useSession();
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState("최신순");

  // 등록 모달 제어
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 수정 모달 및 수정 데이터 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMaking, setEditMaking] = useState("");
  const [editIngredients, setEditIngredients] = useState(""); // JSON 문자열
  const [editImageUrl, setEditImageUrl] = useState("");

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

  // 레시피 등록 (POST)
  const handleSubmitRecipe = async (formData, onClose) => {
    try {
      const queryParams = new URLSearchParams({
        userId: session?.user?.id,
        name: formData.get("name"),
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
      if (!res.ok) throw new Error("레시피 생성에 실패했습니다.");
      const data = await res.json();
      console.log("레시피 등록 성공:", data);
      onClose();
      fetchRecipes();
    } catch (error) {
      console.error("레시피 생성 에러:", error);
    }
  };

  // 레시피 삭제 (DELETE)
  const handleDeleteRecipe = async (id, recipeWriteUser) => {
    if (recipeWriteUser === session?.user?.id) {
      try {
        const url = `/api/v1/highball/recipes-delete?id=${id}`;
        console.log("레시피 삭제 API 요청 URL:", url);
        const res = await fetch(url, { method: "DELETE" });
        if (!res.ok) throw new Error("삭제 실패");
        setRecipes((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("레시피 삭제 오류:", error);
      }
    } else {
      console.error("삭제 권한이 없습니다.");
    }
  };

  // 좋아요 업데이트
  const handleUpdateLike = (itemId, newLikeCount) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === itemId ? { ...r, likeCount: newLikeCount } : r))
    );
  };

  // 수정 버튼 클릭 시: 기존 레시피 데이터를 상태에 저장 후 수정 모달 열기
  const handleEditRecipe = (recipe) => {
    setRecipeToEdit(recipe);
    setEditName(recipe.name || "");
    setEditMaking(recipe.making || "");
    setEditIngredients(recipe.ingredients ? JSON.stringify(recipe.ingredients) : "");
    setEditImageUrl(recipe.imageUrl || "");
    setIsEditModalOpen(true);
  };

  // 레시피 수정 (PUT)
  // RecipeForm의 onSubmit(formData, onClose) 콜백으로 생성한 FormData 사용
  const handleSubmitEdit = async (formData, onClose) => {
    try {
      const url = `/api/v1/highball/modify?userId=${session?.user?.id}&category=${category}&recipeId=${recipeToEdit.id}`;
      console.log("레시피 수정 API 요청 URL:", url);
      const res = await fetch(url, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("레시피 수정에 실패했습니다.");
      const data = await res.json(); // 백엔드가 JSON 응답을 보내도록 가정
      console.log("레시피 수정 성공:", data);
      onClose();
      fetchRecipes();
    } catch (error) {
      console.error("레시피 수정 오류:", error);
    }
  };

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
          isDisabled={status === "authenticated" ? false : true}
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
          onEdit={handleEditRecipe}
          onLikeToggle={handleUpdateLike}
        />
      ))}

      {/* 등록 모달 */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="auto" className="mx-4">
        <ModalContent>
          {(onClose) => (
            <RecipeForm onClose={onClose} onSubmit={handleSubmitRecipe} />
          )}
        </ModalContent>
      </Modal>

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} placement="auto" className="mx-4">
          <ModalContent>
            {(onClose) => (
              <RecipeForm
                onClose={onClose}
                onSubmit={handleSubmitEdit}
                initialName={editName}
                initialMaking={editMaking}
                initialIngredientsJSON={editIngredients}
                initialImageUrl={editImageUrl}
              />
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
