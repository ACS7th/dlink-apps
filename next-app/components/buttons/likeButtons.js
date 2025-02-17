"use client";

import { useState, useEffect } from "react";

export default function Like({
  itemId,
  userEmail, // 부모에서 session.user.email 전달
  initialLikes = 0,
  initialLiked = false,
  className = "",
  readOnly = false,
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [isProcessing, setIsProcessing] = useState(false);

  // (1) 페이지 최초 렌더링 시 서버에서 현재 좋아요 수 조회
  useEffect(() => {
    async function fetchLikeCounts() {
      try {
        const res = await fetch(`/api/v1/highball/like-counts?id=${itemId}`, {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("좋아요 수 조회 실패");
        }
        const data = await res.json();
        const newCount = data.likeCount !== undefined ? data.likeCount : data;
        setLikes(newCount);
      } catch (error) {
        console.error("[LikeButton] 좋아요 수 조회 에러:", error);
      }
    }
    if (itemId) {
      fetchLikeCounts();
    }
  }, [itemId]);

  // // 디버깅: 전달된 값 확인
  // useEffect(() => {
  //   console.log("Like 컴포넌트 - itemId:", itemId, "userEmail:", userEmail);
  // }, [itemId, userEmail]);

  // (2) 좋아요 버튼 클릭 (낙관적 업데이트 적용)
  const handleToggle = async () => {
    if (readOnly || isProcessing) return;

    setIsProcessing(true);

    // 낙관적 업데이트
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => (newLiked ? prev + 1 : prev - 1));

    try {
      // API 요청 URL: 백엔드는 쿼리 파라미터 이름으로 email을 기대하는 경우가 있으므로 주의
      const url = `/api/v1/highball/like?id=${itemId}&userId=${userEmail}`;
      console.log("좋아요 요청 URL:", url);
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) {
        throw new Error("좋아요 토글 실패");
      }
      const data = await res.text(); // 백엔드가 텍스트 응답 반환
      console.log("좋아요 토글 응답:", data);
    } catch (error) {
      console.error("좋아요 토글 오류:", error);
      // 실패 시 낙관적 업데이트 복구
      setLiked(!newLiked);
      setLikes((prev) => (newLiked ? prev - 1 : prev + 1));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isProcessing} // 요청 중에는 비활성화
      className={`flex flex-col items-center ${className} text-gray-600 hover:text-red-500 transition-colors`}
    >
      {liked ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="red"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                   2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                   1.09-1.28 2.76-2.09 4.5-2.09
                   3.08 0 5.5 2.42 5.5 5.5
                   0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                   2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                   1.09-1.28 2.76-2.09 4.5-2.09
                   3.08 0 5.5 2.42 5.5 5.5
                   0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )}
      <span className="text-xs mt-1">{likes}</span>
    </button>
  );
}