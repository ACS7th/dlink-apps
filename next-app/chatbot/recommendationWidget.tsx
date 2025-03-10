// components/RecommendationWidget.jsx
import React from "react";
import { Button } from "@heroui/react";

const RecommendationWidget = () => {
  // 추천할 하이볼 레시피 (예제)
  const recommendations = [
    { name: "레몬 엘더 플라워 스플리처", url: "/highballs?subcategory=vodka&highballId=67b68ea27434c1d6076ec564" },
    { name: "위스키 사워", url: "/highballs?subcategory=gin&highballId=67c31c8427a37d2c8c9bfaf0" },
    { name: "블러디 메리", url: "/highballs?subcategory=gin&highballId=67c31c8427a37d2c8c9bfaf0" },
  ];

  return (
    <div className="flex gap-2 mt-2">
      {recommendations.map((item, index) => (
        <Button
          key={index}
          as="a"
          href={item.url}
          variant="flat"
          color="primary"
          className="px-4 py-2 text-sm"
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default RecommendationWidget;
