"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Spinner, Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { Modal, ModalContent } from "@heroui/modal";
import { useSearchParams } from "next/navigation";
import ReviewCard from "@/components/review/reviewcard";
import ReviewForm from "@/components/review/reivewform";
import FilterDropdown from "@/components/dropdown/filterDropdown";

export default function ReviewSection() {
  const { data: session, status } = useSession({ required: true });
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const drinkId = searchParams.get("drinkId");

  // 리뷰 목록과 정렬 옵션 상태
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("최신순"); // "최신순" 또는 "추천순"

  // 리뷰 작성 모달 상태 및 폼 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // 리뷰 목록 불러오기
  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/v1/reviews/search?category=${category}&drinkId=${drinkId}`);

      if (!res.ok) {
        throw new Error(`리뷰 목록을 불러오지 못했습니다. 서버 응답 코드: ${res.status}`);
      }

      const data = await res.json();

      if (!data || Object.keys(data).length === 0) {
        console.warn("리뷰 데이터가 비어있습니다.");
        return;
      }

      setReviews(data);
    } catch (error) {
      console.error("리뷰 불러오기 실패:", error.message);
    }
  };

  useEffect(() => {
    if (category && drinkId) {
      fetchReviews();
    }
  }, [category, drinkId]);

  // 리뷰 등록 처리
  const handleSubmitReview = async () => {
    try {
      const userId = session?.user?.id;
      if (!userId) throw new Error("로그인이 필요합니다.");

      const res = await fetch("/api/v1/reviews/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          drinkId,
          userId,
          rating: selectedRating,
          content: reviewText,
        }),
      });

      if (!res.ok) throw new Error("리뷰 생성에 실패했습니다.");

      // 초기화 후 모달 닫기 및 목록 갱신
      setSelectedRating(0);
      setReviewText("");
      setIsModalOpen(false);
      fetchReviews();
    } catch (error) {
      console.error("리뷰 생성 에러:", error);
    }
  };


  // 정렬된 리뷰 배열 계산 (정렬 옵션에 따라)
  const sortedReviews = [...reviews].sort((a, b) => {
    if (filter === "최신순") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (filter === "추천순") {
      // 예시로 평점(rating)을 기준으로 정렬
      return b.rating - a.rating;
    } else {
      return 0;
    }
  });

  // 정렬 옵션 배열
  const sortOptions = [
    { value: "최신순", label: "최신순" },
    { value: "추천순", label: "추천순" },
  ];

  if (status === "loading") {
    return <Spinner className="flex mt-4" />;
  }

  return (
    <div className="w-full max-w-full mx-auto p-4 md:p-6">
      {/* 헤더 */}
      <h1 className="text-2xl font-bold text-[#6F0029] mb-1">평가 & 리뷰</h1>
      <div className="h-[3px] bg-[#6F0029] mb-4" />

      {/* 정렬 옵션 및 리뷰 작성 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <FilterDropdown
          title="정렬 옵션"
          options={sortOptions}
          selectedOption={filter}
          onOptionChange={setFilter}
          className="mr-2"
        />
        <Button
          onPress={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1 text-sm text-white bg-[#6F0029] px-3 py-1.5 rounded hover:bg-[#8F0033]"
        >
          리뷰 작성
        </Button>
      </div>

      {/* 리뷰 목록 */}
      {sortedReviews.length > 0 ? (
        sortedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} resolvedTheme={resolvedTheme} />
        ))
      ) : (
        <div className="py-4 text-center">리뷰가 없습니다.</div>
      )}

      {/* 리뷰 작성 모달 */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          placement="center"
          className="mx-4"
        >
          <ModalContent>
            <ReviewForm
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              reviewText={reviewText}
              setReviewText={setReviewText}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleSubmitReview}
            />
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
