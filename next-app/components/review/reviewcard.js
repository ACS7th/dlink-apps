"use client";

import { Card, CardBody } from "@heroui/card";

export default function ReviewCard({ review, resolvedTheme }) {
  return (
    <Card className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"} p-4 mb-4`}>
      <CardBody>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">평점: {review.rating} / 5</p>
            <p className="text-sm">리뷰: {review.content}</p>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleString()}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">작성자: {review.userId}</p>
      </CardBody>
    </Card>
  );
}
