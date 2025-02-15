"use client";

import { useState, useEffect } from "react";

export default function LikeButton({ itemId, userEmail, initialLikes = 0, initialLiked = false, className = "" }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);

  // 컴포넌트 마운트 시, 서버에서 좋아요 수 조회
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
        // 백엔드가 { likeCount: number } 형태로 반환하면 data.likeCount, 아니라면 data 자체가 숫자일 수 있음
        setLikes(data.likeCount !== undefined ? data.likeCount : data);
      } catch (error) {
        console.error("좋아요 수 조회 에러:", error);
      }
    }
    if (itemId) {
      fetchLikeCounts();
    }
  }, [itemId]);

  // 좋아요 버튼 클릭 시 처리 함수
  async function handleLike() {
    try {
      // 로컬 liked 토글
      const newLiked = !liked;
      setLiked(newLiked);

      // POST 요청으로 좋아요 토글: /api/v1/highball/like?id=xxx&email=yyy
      const res = await fetch(`/api/v1/highball/like?id=${itemId}&email=${encodeURIComponent(userEmail)}`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("좋아요 API 호출 실패");
      }

      // API 호출 후 최신 좋아요 수를 다시 조회
      const countRes = await fetch(`/api/v1/highball/like-counts?id=${itemId}`, {
        method: "GET",
      });
      if (!countRes.ok) {
        throw new Error("좋아요 수 재조회 실패");
      }
      const countData = await countRes.json();
      setLikes(countData.likeCount !== undefined ? countData.likeCount : countData);
    } catch (error) {
      console.error("좋아요 처리 에러:", error);
    }
  }

  return (
    <button
      onClick={handleLike}
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
