// "use client";

// import { useState } from "react";

// export default function StarRating({
//   totalStars = 5,
//   value,
//   onChange,
//   readOnly = false,
//   className = "",
// }) {
//   const [internalRating, setInternalRating] = useState(0);
//   const [hover, setHover] = useState(0);

//   // 만약 value prop이 있으면 controlled mode로 동작, 없으면 내부 state 사용
//   const currentRating = value !== undefined ? value : internalRating;

//   const handleRating = (val) => {
//     if (readOnly) return;
//     if (currentRating === val) {
//       if (value !== undefined) {
//         onChange && onChange(0);
//       } else {
//         setInternalRating(0);
//         onChange && onChange(0);
//       }
//     } else {
//       if (value !== undefined) {
//         onChange && onChange(val);
//       } else {
//         setInternalRating(val);
//         onChange && onChange(val);
//       }
//     }
//   };

//   return (
//     <div className={`flex flex-row-reverse justify-end text-xl space-x-reverse space-x-0.5 ml-2 ${className}`}>
//       {Array.from({ length: totalStars }, (_, index) => {
//         const starValue = totalStars - index;
//         return (
//           <label
//             key={starValue}
//             className={`
//               ${!readOnly ? "cursor-pointer" : ""}
//               transition-colors duration-300
//               ${(hover || currentRating) >= starValue ? "text-yellow-500" : "text-gray-400"}
//             `}
//             onClick={() => handleRating(starValue)}
//             onMouseEnter={() => { if (!readOnly) setHover(starValue); }}
//             onMouseLeave={() => { if (!readOnly) setHover(0); }}
//           >
//             ★
//           </label>
//         );
//       })}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";

export default function LikeButton({
  itemId,
  userEmail,
  initialLikes = 0,
  initialLiked = false,
  className = "",
  readOnly = false
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);

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

  // (2) 좋아요 버튼 클릭 (낙관적 업데이트 적용, readOnly일 경우 아무 작업도 하지 않음)
  async function handleLike() {
    if (readOnly) return; // readOnly이면 클릭 무시

    const newLiked = !liked;
    // 낙관적 업데이트: 즉시 상태 변경
    setLiked(newLiked);
    setLikes((prevLikes) => (newLiked ? prevLikes + 1 : prevLikes - 1));

    try {
      // 서버에 좋아요 토글 요청
      const res = await fetch(
        `/api/v1/highball/like?id=${itemId}&email=${encodeURIComponent(userEmail)}`,
        { method: "POST" }
      );
      if (!res.ok) {
        throw new Error("좋아요 API 호출 실패");
      }

      // (3) 서버에서 최종 좋아요 수를 다시 조회하여 반영
      const countRes = await fetch(`/api/v1/highball/like-counts?id=${itemId}`, {
        method: "GET",
      });
      if (!countRes.ok) {
        throw new Error("좋아요 수 재조회 실패");
      }
      const countData = await countRes.json();
      const finalCount = countData.likeCount !== undefined ? countData.likeCount : countData;
      setLikes(finalCount);
    } catch (error) {
      console.error("[LikeButton] 좋아요 처리 에러:", error);
      // API 호출 실패 시, 낙관적 업데이트를 되돌림
      setLiked((prev) => !prev);
      setLikes((prevLikes) => (newLiked ? prevLikes - 1 : prevLikes + 1));
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
