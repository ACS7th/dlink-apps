"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
} from "@heroui/react";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import StarRating from "@/components/starrating/starRating"; // 리뷰 모달에 사용
import Like from "@/components/buttons/likeButtons"; // 좋아요 버튼 컴포넌트

export default function RecipeSection({ title, buttonName, subtitle }) {
  const { data: session, status } = useSession({ required: true });
  const { resolvedTheme } = useTheme();

  // === 레시피 입력 필드 state (하이볼 레시피 모드) ===
  const [engName, setEngName] = useState("");
  const [korName, setKorName] = useState("");
  const [category, setCategory] = useState("");
  const [making, setMaking] = useState("");
  const [ingredientsJSON, setIngredientsJSON] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // === 리뷰 입력 필드 state (평가 & 리뷰 모드) ===
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // 목록 state (레시피 또는 리뷰 목록)
  const [items, setItems] = useState([]);

  // 기타 UI 관련 state
  const [filter, setFilter] = useState("추천순");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement] = useState("auto");

  const loggedInUser = {
    id: session?.user?.email,
  };

  // 목록 가져오기 (타이틀에 따라 다른 API 호출)
  const fetchItems = async () => {
    try {
      if (title === "하이볼 레시피") {
        const res = await fetch("/api/v1/highball/category?category=Gin", {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("레시피 목록을 불러오지 못했습니다.");
        }
        const data = await res.json();
        setItems(data);
      } else if (title === "평가 & 리뷰") {
        const res = await fetch("/api/v1/highball/review", {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("리뷰 목록을 불러오지 못했습니다.");
        }
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (title === "하이볼 레시피" || title === "평가 & 리뷰") {
      fetchItems();
    }
  }, [title]);

  // === 레시피 생성 API 호출 (POST) ===
  const handleSubmitRecipe = async (onClose) => {
    try {
      if (title !== "하이볼 레시피") {
        onClose();
        return;
      }
      const queryParams = new URLSearchParams({
        engName,
        korName,
        category,
        making,
        ingredientsJSON,
      });

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

      // 초기화 및 목록 새로 불러오기
      setEngName("");
      setKorName("");
      setCategory("");
      setMaking("");
      setIngredientsJSON("");
      setSelectedImage(null);
      onClose();
      fetchItems();
    } catch (error) {
      console.error("레시피 생성 에러:", error);
    }
  };

  // === 평가 & 리뷰 생성 API 호출 (POST) ===
  const handleSubmitReview = async (onClose) => {
    try {
      if (title !== "평가 & 리뷰") {
        onClose();
        return;
      }
      const res = await fetch("/api/v1/highball/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: selectedRating,
          comment: reviewText,
          userId: loggedInUser.id,
        }),
      });
      if (!res.ok) throw new Error("리뷰 생성에 실패했습니다.");

      setSelectedRating(0);
      setReviewText("");
      onClose();
      fetchItems();
    } catch (error) {
      console.error("리뷰 생성 에러:", error);
    }
  };

  // 모달 오픈 시 필드 초기화 (타이틀에 따라 분기)
  const handleOpenModal = () => {
    if (title === "하이볼 레시피") {
      setEngName("");
      setKorName("");
      setCategory("");
      setMaking("");
      setIngredientsJSON("");
      setSelectedImage(null);
    } else if (title === "평가 & 리뷰") {
      setSelectedRating(0);
      setReviewText("");
    }
    onOpen();
  };

  // === 레시피 삭제 기능 추가 ===
  const handleDeleteRecipe = (id) => {
    // 여기서는 상태에서 제거하는 예시 (실제 프로젝트에서는 API 호출 필요)
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {status === "loading" ? (
        <Spinner className="flex mt-4" />
      ) : (
        <>
          <div className="w-full max-w-full mx-auto p-4 md:p-6">
            <h1 className="text-2xl font-bold text-[#6F0029] mb-1">{title}</h1>
            <div className="h-[3px] bg-[#6F0029] mb-4" />

            <div className="flex justify-between items-center">
              <button
                className="inline-flex items-center space-x-1 text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50"
                onClick={() =>
                  setFilter(filter === "추천순" ? "최신순" : "추천순")
                }
              >
                <span>{filter}</span>
              </button>

              <Button
                onPress={handleOpenModal}
                className="inline-flex items-center space-x-1 text-sm text-white bg-[#6F0029] px-3 py-1.5 rounded hover:bg-[#8F0033]"
              >
                {buttonName}
              </Button>
            </div>
          </div>

          {/* 목록 렌더링 (레시피 또는 리뷰 목록) */}
          <div className="w-full max-w-full mx-auto p-1">
            {items.map((item) => (
              <Card
                key={item.id}
                className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"
                  } p-4 mb-4`}
              >
                <CardBody>
                  {title === "하이볼 레시피" ? (
                    <div>
                      {/* 카드 최상단에 사용자 프로필(아바타)와 이메일 표시 */}
                      <div className="flex items-center mb-2">
                        <img
                          className="w-8 h-8 rounded-full mr-2"
                          src={item.userImage || "/default-avatar.png"}
                          alt="User Profile"
                        />
                        <p className="text-xs text-gray-500">
                          {item.userId}
                        </p>
                      </div>
                      <p className="text-sm font-bold">{item.korName}</p>
                      <p className="text-sm">{item.engName}</p>
                      <p className="text-sm">Category: {item.category}</p>
                      <p className="text-sm">Making: {item.making}</p>
                      <p className="text-sm">
                        Ingredients: {item.ingredientsJSON}
                      </p>
                      <div className="flex justify-end mt-2">
                        <Like className="flex flex-row" />
                        {item.userId === loggedInUser.id && (
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
                    </div>
                  ) : title === "평가 & 리뷰" ? (
                    <div>
                      <p className="text-sm">
                        평점: {item.rating} / 5
                      </p>
                      <p className="text-sm">리뷰: {item.comment}</p>
                      <p className="text-xs text-gray-500">
                        작성자: {item.user}
                      </p>
                    </div>
                  ) : null}
                </CardBody>
              </Card>
            ))}
          </div>

          {/* 모달 */}
          <Modal
            isOpen={isOpen}
            placement={modalPlacement}
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  {title === "하이볼 레시피" ? (
                    <>
                      <ModalHeader className="flex flex-col">
                        {subtitle ? subtitle : "하이볼 레시피 작성"}
                      </ModalHeader>
                      <ModalBody>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              engName
                            </label>
                            <input
                              type="text"
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              placeholder="fesf"
                              value={engName}
                              onChange={(e) => setEngName(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              korName *
                            </label>
                            <input
                              type="text"
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              placeholder="테스트"
                              value={korName}
                              onChange={(e) => setKorName(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              category *
                            </label>
                            <input
                              type="text"
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              placeholder="Gin"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              making *
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
                              placeholder='{"test": "test", "testset": "33"}'
                              variant="bordered"
                              value={ingredientsJSON}
                              onChange={(e) =>
                                setIngredientsJSON(e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Image File (선택)
                            </label>
                            <input
                              type="file"
                              className="mt-1 block w-full"
                              onChange={(e) =>
                                setSelectedImage(e.target.files[0])
                              }
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
                  ) : title === "평가 & 리뷰" ? (
                    <>
                      <ModalHeader className="flex flex-col">
                        {subtitle ? subtitle : "평가 & 리뷰 작성"}
                      </ModalHeader>
                      <ModalBody>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              평점
                            </label>
                            <StarRating
                              totalStars={5}
                              value={selectedRating}
                              onChange={setSelectedRating}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              리뷰 내용
                            </label>
                            <Textarea
                              isClearable
                              className="mt-1 block w-full"
                              placeholder="리뷰를 입력하세요"
                              variant="bordered"
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
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
                          onPress={() => handleSubmitReview(onClose)}
                        >
                          등록
                        </Button>
                      </ModalFooter>
                    </>
                  ) : null}
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
}
