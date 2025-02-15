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
import Like from "@/components/buttons/likeButtons"; // 서버 API와 연동하는 좋아요 버튼 컴포넌트

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
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  // === 리뷰 입력 필드 state (평가 & 리뷰 모드) ===
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // 목록 state (레시피 또는 리뷰 목록)
  const [items, setItems] = useState([]);

  // 기타 UI 관련 state
  const [filter, setFilter] = useState("추천순");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement] = useState("auto");

  // 세션에서 사용자 이메일을 ID로 사용
  const loggedInUser = {
    id: session?.user?.email,
  };

  // 목록 가져오기 (기존 API 엔드포인트 그대로 사용)
  const fetchItems = async () => {
    try {
      if (title === "하이볼 레시피") {
        // 기존 API: category=Gin (추후 추가 카테고리 적용 가능)
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

  // 레시피 생성/수정 (POST / PATCH)
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
      let res;
      if (editingRecipeId) {
        // 수정 (PATCH)
        res = await fetch(
          `/api/v1/highball/recipes/${editingRecipeId}?${queryParams.toString()}`,
          {
            method: "PATCH",
            body: formData,
          }
        );
      } else {
        // 생성 (POST)
        res = await fetch(
          `/api/v1/highball/recipes-post?${queryParams.toString()}`,
          {
            method: "POST",
            body: formData,
          }
        );
      }
      if (!res.ok) throw new Error("레시피 생성/수정에 실패했습니다.");

      // 입력 필드 초기화 및 목록 갱신
      setEngName("");
      setKorName("");
      setCategory("");
      setMaking("");
      setIngredientsJSON("");
      setSelectedImage(null);
      setEditingRecipeId(null);
      onClose();
      fetchItems();
    } catch (error) {
      console.error("레시피 생성/수정 에러:", error);
    }
  };

  // 레시피 삭제 (DELETE)
  const handleDeleteRecipe = async (id) => {
    try {
      const res = await fetch(`/api/v1/highball/recipes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("레시피 삭제에 실패했습니다.");
      }
      fetchItems();
    } catch (error) {
      console.error("레시피 삭제 에러:", error);
    }
  };

  // 레시피 좋아요 (POST) - 서버 API 연동 (좋아요 버튼은 Like 컴포넌트에서 처리)
  const handleLike = async (id) => {
    try {
      const res = await fetch(`/api/v1/highball/like?itemId=${id}`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("좋아요 수 증가에 실패했습니다.");
      }
      fetchItems();
    } catch (error) {
      console.error("좋아요 수 증가 에러:", error);
    }
  };

  // 리뷰 생성 (POST)
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

  // 모달 열기 시 필드 초기화
  const handleOpenModal = () => {
    if (title === "하이볼 레시피") {
      setEngName("");
      setKorName("");
      setCategory("");
      setMaking("");
      setIngredientsJSON("");
      setSelectedImage(null);
      setEditingRecipeId(null);
    } else if (title === "평가 & 리뷰") {
      setSelectedRating(0);
      setReviewText("");
    }
    onOpen();
  };

  // 레시피 수정 버튼 클릭 시 호출
  const handleEditRecipe = (item) => {
    setEngName(item.engName || "");
    setKorName(item.korName || "");
    setCategory(item.category || "");
    setMaking(item.making || "");
    setIngredientsJSON(item.ingredientsJSON || "");
    // 이미지 업데이트는 별도 처리 (여기서는 null로 초기화)
    setSelectedImage(null);
    setEditingRecipeId(item.id);
    onOpen();
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

          {/* 레시피 또는 리뷰 목록 */}
          <div className="w-full max-w-full mx-auto p-1">
            {items.map((item) => (
              <Card
                key={item.id}
                className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"
                  } p-4 mb-4`}
              >
                <CardBody>
                  {title === "하이볼 레시피" ? (
                    <div className="flex flex-col">
                      {/* 상단: 아바타와 userId */}
                      <div className="flex items-center mb-2">
                        <img
                          className="w-8 h-8 rounded-full mr-2"
                          src={item.userImage || "/avatar.png"}
                          alt="User Profile"
                        />
                        <p className="text-xs text-gray-500">{item.userId}</p>
                      </div>
                      {/* 레시피 정보 */}
                      <div className="flex flex-col">
                        <p className="text-sm font-bold">{item.korName}</p>
                        <p className="text-sm">{item.engName}</p>
                        <p className="text-sm">Category: {item.category}</p>
                        <p className="text-sm">Making: {item.making}</p>
                        <p className="text-sm">
                          Ingredients: {item.ingredientsJSON}
                        </p>
                      </div>
                      {/* 좋아요 + 수정/삭제 */}
                      <div className="flex justify-end mt-2">
                        <div className="flex flex-col items-center">
                          <Like
                            className="flex flex-col cursor-pointer"
                            onPress={() => handleLike(item.id)}
                            itemId={item.id} userEmail={loggedInUser.id}
                          />
                          <span className="mt-1 text-xs">{item.likeCount || 0}</span>
                        </div>
                        {item.userId === loggedInUser.id && (
                          <>
                            <Button
                              color="primary"
                              variant="light"
                              onPress={() => handleEditRecipe(item)}
                              className="w-10 h-5 ml-2"
                            >
                              수정
                            </Button>
                            <Button
                              color="danger"
                              variant="light"
                              onPress={() => handleDeleteRecipe(item.id)}
                              className="w-10 h-5 ml-2"
                            >
                              삭제
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : title === "평가 & 리뷰" ? (
                    <div>
                      <p className="text-sm">평점: {item.rating} / 5</p>
                      <p className="text-sm">리뷰: {item.comment}</p>
                      <p className="text-xs text-gray-500">작성자: {item.user}</p>
                    </div>
                  ) : null}
                </CardBody>
              </Card>
            ))}
          </div>

          {/* 모달 */}
          <Modal isOpen={isOpen} placement={modalPlacement} onOpenChange={onOpenChange}>
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
                              placeholder="Avalon"
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
                              placeholder="아발론"
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
                              placeholder="Vodka"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              glass
                            </label>
                            <input
                              type="text"
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              placeholder="Highball glass"
                              // glass 필드를 사용하고 싶다면 state와 onChange 추가
                              onChange={(e) => { }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              image
                            </label>
                            <input
                              type="text"
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              placeholder="https://www.thecocktaildb.com/images/media/drink/3k9qic1493068931.jpg"
                              // image URL을 사용하고 싶다면 state와 onChange 추가
                              onChange={(e) => { }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              making *
                            </label>
                            <Textarea
                              isClearable
                              className="mt-1 block w-full"
                              placeholder="Fill a tall glass with ice..."
                              variant="bordered"
                              value={making}
                              onChange={(e) => setMaking(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              ingredients (JSON)
                            </label>
                            <Textarea
                              isClearable
                              className="mt-1 block w-full"
                              placeholder='{"ing1": "3 parts Vodka", "ing2": "1 part Pisang Ambon", "ing3": "6 parts Apple juice", "ing4": "1 1/2 part Lemon juice", "ing5": "Lemonade"}'
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
                        <Button color="bg-primary" onPress={() => handleSubmitRecipe(onClose)}>
                          {editingRecipeId ? "수정" : "등록"}
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
                        <Button color="bg-primary" onPress={() => handleSubmitReview(onClose)}>
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
