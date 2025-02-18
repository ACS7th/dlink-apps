"use client";

import { Card, CardBody } from "@heroui/card";
import { User, Textarea } from "@heroui/react";
import CardMenu from "@/components/review/cardmenu";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import StarRating from "@/components/starrating/starRating";

export default function ReviewCard({ session, review, resolvedTheme, onDelete, onEdit, readOnly = false }) {
  console.log("🔍 ReviewCard 데이터 확인:", review); // ✅ 리뷰 데이터 확인

  if (!review) {
    return <div className="text-center text-gray-500">리뷰 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <Card className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"} p-4 mb-4 relative`}>
      <CardBody>
        {/* 상단 우측에 메뉴 버튼 (작성자일 경우) */}
        {session?.user?.id === review.id && (
          <div className="absolute top-2 right-2">
            <CardMenu
              onEdit={() => { if (onEdit) onEdit(review); }}
              onDelete={() => { if (onDelete) onDelete(review.id); }}
            />
          </div>
        )}

        {/* 작성자 정보 */}
        <div className="flex items-center mb-2">
          <User
            avatarProps={{
              src: "/favicon.ico",
            }}
            name={`사용자 ${review.id.slice(-5)}`} // 사용자 ID 일부 표시
            description="리뷰 작성자"
          />
        </div>

        {/* 리뷰 평점 (StarRating 적용) */}
        <div className="flex items-center mb-2">
          <p className="text-sm font-semibold mr-2">평점:</p>
          <StarRating value={parseInt(review.rating, 10)} readOnly className="text-lg" />
        </div>

        {/* 리뷰 내용 */}
        <div className="mb-2">
          <Textarea
            isReadOnly
            className="max-w-full mt-1"
            defaultValue={review.content}
            variant="bordered"
          />
        </div>

        {/* 작성일 없음 → 현재 시간 대체 */}
        <div className="text-xs text-gray-500 mt-2">
          작성 시간: {new Date().toLocaleString()}
        </div>
      </CardBody>
    </Card>
  );
}
