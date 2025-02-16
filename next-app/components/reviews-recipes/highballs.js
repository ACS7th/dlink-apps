"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { User, Button, useDisclosure, Textarea, Image } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import Like from "@/components/buttons/likeButtons";
import { useSearchParams } from "next/navigation";

export default function HighballSection() {
  const { data: session, status } = useSession({ required: true });
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  // === 레시피 입력 필드 state ===
  const [userId, setUserId] = useState("");
  const [engName, setEngName] = useState("");
  const [korName, setKorName] = useState("");
  const [making, setMaking] = useState("");
  const [ingredientsJSON, setIngredientsJSON] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // 레시피 목록 state
  const [recipes, setRecipes] = useState([]);
  // 필터 예시
  const [filter, setFilter] = useState("추천순");

  // 모달 제어 (HeroUI Modal)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 하이볼 레시피 목록 불러오기
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
    // 세션에서 사용자 ID를 설정 (DB 고유 ID 사용)
    if (session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session]);

  // 컴포넌트 마운트 시 또는 category 변경 시 레시피 목록 불러오기
  useEffect(() => {
    if (category) {
      fetchRecipes();
    }
  }, [category, fetchRecipes]);

  // 레시피 작성
  const handleSubmitRecipe = async (onClose) => {
    try {
      const queryParams = new URLSearchParams({
        userId,
        engName,
        korName,
        category,
        making,
        ingredientsJSON,
      });

      console.log("QueryParams:", queryParams.toString());
      const formData = new FormData();
      if (selectedImage) {
        formData.append("imageFile", selectedImage, selectedImage.name);
      }

      // API 요청: /api/v1/highball/recipes-post?{queryParams}
      const res = await fetch(`/api/v1/highball/recipes-post?${queryParams.toString()}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("레시피 생성에 실패했습니다.");

      // 폼 초기화
      setEngName("");
      setKorName("");
      setMaking("");
      setIngredientsJSON("");
      setSelectedImage(null);

      onClose();
      fetchRecipes(); // 등록 후 리스트 새로고침
    } catch (error) {
      console.error("레시피 생성 에러:", error);
    }
  };

  // 레시피 삭제 (로그인한 사용자가 등록한 레시피에만 DELETE API 호출)
  const handleDeleteRecipe = async (id, recipeWriteUser) => {
    // 비교: DB에 저장된 writeUser와 세션의 user.id
    if (recipeWriteUser === session?.user?.id) {
      try {
        // DELETE 요청: /api/v1/highball/recipe/{id}
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

  // 모달 열기 (폼 초기화)
  const handleOpenModal = () => {
    setEngName("");
    setKorName("");
    setMaking("");
    setIngredientsJSON("");
    setSelectedImage(null);
    onOpen();
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
          onPress={handleOpenModal}
          className="inline-flex items-center space-x-1 text-sm text-white bg-[#6F0029] px-3 py-1.5 rounded hover:bg-[#8F0033]"
        >
          레시피 작성
        </Button>
      </div>

      {/* 레시피 목록 */}
      {recipes.map((item) => (
        <Card
          key={item.id}
          className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"} p-4 mb-4`}
        >
          <CardBody>
            {/* 카드 상단: 등록한 사용자 프로필 정보 표시 */}
            <div className="flex items-center mb-2">
              <User
                avatarProps={{
                  src:
                    item.writeUser === session?.user?.id
                      ? session?.user?.profileImageUri || ""
                      : "",
                }}
                name={
                  item.writeUser === session?.user?.id
                    ? session.user.name
                    : item.writeUser
                }
                description={
                  item.writeUser === session?.user?.id ? session.user.email : ""
                }
              />
            </div>
            <div className="mb-2">
              <h4 className="font-semibold text-lg">
                🍹 {item.engName} ({item.korName})
              </h4>
              <p className="mb-1">Category: {item.category}</p>
              <p className="mb-1">Making: {item.making}</p>
              <p className="text-sm">Ingredients: {item.ingredientsJSON}</p>
            </div>
            {/* 하단: 삭제 버튼은 왼쪽, 좋아요 버튼은 오른쪽 */}
            <div className="flex justify-between items-center mt-2">
              <div>
                {item.writeUser === session?.user?.id && (
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => handleDeleteRecipe(item.id, item.writeUser)}
                    className="w-10 h-5"
                  >
                    삭제
                  </Button>
                )}
              </div>
              <div>
                <Like
                  className="flex flex-row"
                  itemId={item.id}
                  userEmail={session.user.email}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="auto" className="mx-4">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>하이볼 레시피 작성</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">engName</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="예: Highball"
                      value={engName}
                      onChange={(e) => setEngName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">korName</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="예: 하이볼"
                      value={korName}
                      onChange={(e) => setKorName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">making</label>
                    <Textarea
                      isClearable
                      className="mt-1 block w-full"
                      placeholder="하이볼 만드는 방법"
                      variant="bordered"
                      value={making}
                      onChange={(e) => setMaking(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ingredientsJSON</label>
                    <Textarea
                      isClearable
                      className="mt-1 block w-full"
                      placeholder='예: {"진": "50ml", "토닉워터": "100ml"}'
                      variant="bordered"
                      value={ingredientsJSON}
                      onChange={(e) => setIngredientsJSON(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image File (선택)</label>
                    <input
                      type="file"
                      className="mt-1 block w-full"
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  취소
                </Button>
                <Button color="bg-primary" onPress={() => handleSubmitRecipe(onClose)}>
                  등록
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
