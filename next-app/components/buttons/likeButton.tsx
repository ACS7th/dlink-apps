"use client";

import { useState, useEffect } from "react";
import "@/styles/like-button.css";

export default function LikeButton({
    itemId,
    userid,
    initialLikes = 0,
    initialLiked = false,
    className = "",
    readOnly = false,
    onLikeToggle, // 부모에 좋아요 수 업데이트를 알리기 위한 콜백
}) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(initialLiked);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        async function fetchLikeCounts() {
            try {
                const res = await fetch(
                    `/api/v1/highball/like-counts?id=${itemId}`,
                    {
                        method: "GET",
                    }
                );
                if (!res.ok) {
                    throw new Error("좋아요 수 조회 실패");
                }
                const data = await res.json();
                setLikes(data.likeCount ?? data);
            } catch (error) {
                console.error("[LikeButton] 좋아요 수 조회 에러:", error);
            }
        }

        if (itemId) {
            fetchLikeCounts();
        }
    }, [itemId]);

    const handleToggle = async () => {
        if (readOnly || isProcessing) return;
        setIsProcessing(true);

        const prevLiked = liked;
        const prevLikes = likes;
        const newLiked = !liked;
        const newLikes = newLiked ? likes + 1 : likes - 1;

        setLiked(newLiked);
        setLikes(newLikes);
        if (onLikeToggle) onLikeToggle(itemId, newLikes);

        try {
            const url = `/api/v1/highball/like?id=${itemId}&userId=${userid}`;
            const res = await fetch(url, { method: "POST" });
            if (!res.ok) throw new Error("좋아요 토글 실패");
        } catch (error) {
            console.error("좋아요 토글 오류:", error);
            setLiked(prevLiked);
            setLikes(prevLikes);
            if (onLikeToggle) onLikeToggle(itemId, prevLikes);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={`${className}`}>
            <button
                onClick={handleToggle}
                disabled={isProcessing}
                className={`like ${liked ? "liked" : "unliked"}`}
            >
                <span
                    className="like-icon like-icon-state"
                    aria-live="polite"
                ></span>
            </button>
            <span className="text-xs mt-1">{likes}</span>
        </div>
    );
}
