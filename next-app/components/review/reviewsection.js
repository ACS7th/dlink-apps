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
  const { data: session, status } = useSession();
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const drinkId = searchParams.get("drinkId");

  // 리뷰 목록과 정렬 옵션 상태
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("최신순");

  // 리뷰 작성 모달 상태 및 폼 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // // 리뷰 목록 불러오기
  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/v1/reviews/search?category=${category}&drinkId=${drinkId}`);

      if (!res.ok) {
        throw new Error(`리뷰 목록을 불러오지 못했습니다. 서버 응답 코드: ${res.status}`);
      }
      const data = await res.json();
      console.log("🔍 리뷰 데이터 확인:", data); // ✅ 데이터 콘솔 출력
      if (!data || Object.keys(data).length === 0) {
        console.warn("🚨 리뷰 데이터가 비어있습니다.");
        setReviews([]);
        return;
      }
      // ✅ 객체 → 배열 변환 후 저장
      const transformedReviews = Object.entries(data).map(([userId, review]) => ({
        id: userId,
        ...review,
      }));
      console.log("✅ 변환된 리뷰 데이터:", transformedReviews);
      setReviews(transformedReviews);
    } catch (error) {
      console.error("❌ 리뷰 불러오기 실패:", error.message);
      setReviews([]);
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

      const newReview = {
        id: userId, // 백엔드에서 유저 ID를 Key로 사용하므로 ID 설정
        rating: selectedRating,
        content: reviewText,
      };

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

      // 기존 리뷰 목록에 추가하여 즉시 업데이트
      setReviews((prevReviews) => [...prevReviews, newReview]);

      // 초기화 후 모달 닫기
      setSelectedRating(0);
      setReviewText("");
      setIsModalOpen(false);

      // 최신 리뷰 목록을 가져옴 (서버 데이터 동기화)
      fetchReviews();
    } catch (error) {
      console.error("리뷰 생성 에러:", error);
    }
  };

  // 정렬된 리뷰 배열 계산 (정렬 옵션에 따라)
  const sortedReviews = Array.isArray(reviews) ? [...reviews].sort((a, b) => {
    if (filter === "최신순") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (filter === "추천순") {
      return b.rating - a.rating;
    } else {
      return 0;
    }
  }) : []; // ✅ `reviews`가 배열인지 체크 후 정렬

  // 정렬 옵션 배열
  const sortOptions = [
    { value: "최신순", label: "최신순" },
  ];

  if (status === "loading") {
    return <Spinner className="flex mt-5" />;
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
          isDisabled={status==="authenticated" ? false : true}
        >
          리뷰 작성
        </Button>
      </div>

      {sortedReviews.length > 0 ? (
        sortedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            resolvedTheme={resolvedTheme}
            session={session}
          />
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
