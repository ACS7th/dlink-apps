"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button, useDisclosure, Textarea } from "@heroui/react";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import StarRating from "@/components/starrating/starRating";

export default function ReviewSection() {
  const { data: session, status } = useSession({ required: true });
  const { resolvedTheme } = useTheme();

  // 리뷰 상태
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("추천순");

  // 모달 제어
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 작성할 리뷰 상태
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // 리뷰 목록 불러오기
  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/v1/highball/review");
      if (!res.ok) throw new Error("리뷰 목록을 불러오지 못했습니다.");
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 리뷰 생성
  const handleSubmitReview = async (onClose) => {
    try {
      const userId = session?.user?.email;
      const res = await fetch("/api/v1/highball/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: selectedRating,
          comment: reviewText,
          userId,
        }),
      });
      if (!res.ok) throw new Error("리뷰 생성에 실패했습니다.");

      // 작성 후 초기화
      setSelectedRating(0);
      setReviewText("");
      onClose();
      fetchReviews();
    } catch (error) {
      console.error("리뷰 생성 에러:", error);
    }
  };

  // 모달 열 때마다 폼 초기화
  const handleOpenModal = () => {
    setSelectedRating(0);
    setReviewText("");
    onOpen();
  };

  if (status === "loading") {
    return <Spinner className="flex mt-4" />;
  }

  return (
    <div className="w-full max-w-full mx-auto p-4 md:p-6">
      {/* 헤더 */}
      <h1 className="text-2xl font-bold text-[#6F0029] mb-1">
        평가 & 리뷰
      </h1>
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
          리뷰 작성
        </Button>
      </div>

      {/* 리뷰 목록 */}
      {reviews.map((review) => (
        <Card
          key={review.id}
          className={`${
            resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"
          } p-4 mb-4`}
        >
          <CardBody>
            <p className="text-sm">평점: {review.rating} / 5</p>
            <p className="text-sm">리뷰: {review.comment}</p>
            <p className="text-xs text-gray-500">작성자: {review.user}</p>
          </CardBody>
        </Card>
      ))}

      {/* 리뷰 작성 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-full max-w-lg rounded-md shadow-lg p-4">
            <h2 className="text-xl font-bold mb-2">평가 & 리뷰 작성</h2>
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
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                color="danger"
                variant="light"
                onPress={() => onOpenChange(false)}
              >
                취소
              </Button>
              <Button
                color="bg-primary"
                onPress={() => handleSubmitReview(() => onOpenChange(false))}
              >
                등록
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
