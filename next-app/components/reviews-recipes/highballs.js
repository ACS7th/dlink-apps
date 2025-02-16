"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  Button,
  useDisclosure,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Image,
} from "@heroui/react";
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
  const [userId, setUserId] = useState();
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
  const fetchRecipes = async () => {
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
  };

  useEffect(() => {
    setUserId(session?.user?.id);
  }, [session]);

  // 컴포넌트 마운트 시 호출
  useEffect(() => {
    fetchRecipes();
  }, [category]);

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

      console.log(queryParams.toString());
      const formData = new FormData();
      if (selectedImage) {
        formData.append("imageFile", selectedImage, selectedImage.name);
      }

      const res = await fetch(
        `/api/v1/highball/recipes-post?${queryParams.toString()}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) throw new Error("레시피 생성에 실패했습니다.");

      // 폼 초기화
      setEngName("");
      setKorName("");
      setMaking("");
      setIngredientsJSON("");
      setSelectedImage(null);

      onClose();
      fetchRecipes(); // 리스트 새로고침
    } catch (error) {
      console.error("레시피 생성 에러:", error);
    }
  };

  // 레시피 삭제 (실제 프로젝트에서는 API 호출 필요)
  const handleDeleteRecipe = (id) => {
    setRecipes((prev) => prev.filter((item) => item.id !== id));
  };

  // 모달 열기
  const handleOpenModal = () => {
    // 열 때마다 폼 초기화
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
          className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"
            } p-4 mb-4`}
        >
          <CardBody>
            <div className="flex items-center mb-2">
              <Image
                className="w-8 h-8 rounded-full mr-2"
                src={item.imageUrl}
                alt="User Profile"
              />
              <p className="text-xs text-gray-500">{item.userId}</p>
            </div>
            <p className="text-sm font-bold">{item.korName}</p>
            <p className="text-sm">{item.engName}</p>
            <p className="text-sm">Category: {item.category}</p>
            <p className="text-sm">Making: {item.making}</p>
            <p className="text-sm">Ingredients: {item.ingredientsJSON}</p>
            <div className="flex justify-end mt-2">
              <Like className="flex flex-row" />
              {item.userId === session?.user?.email && (
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => handleDeleteRecipe(item.id)}
                  className="w-10 h-5 ml-2"
                >
                  삭제
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      ))}

      {/* HeroUI Modal을 이용한 레시피 작성 모달 */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="auto" className="mx-4">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>하이볼 레시피 작성</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      engName
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="예: Highball"
                      value={engName}
                      onChange={(e) => setEngName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      korName
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="예: 하이볼"
                      value={korName}
                      onChange={(e) => setKorName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      making
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                      ingredientsJSON
                    </label>
                    <Textarea
                      isClearable
                      className="mt-1 block w-full"
                      placeholder='{"진": "50ml", "토닉워터": "100ml"}'
                      variant="bordered"
                      value={ingredientsJSON}
                      onChange={(e) => setIngredientsJSON(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Image File (선택)
                    </label>
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
                <Button
                  color="bg-primary"
                  onPress={() => handleSubmitRecipe(onClose)}
                >
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
