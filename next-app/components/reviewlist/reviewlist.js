"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { User } from "@heroui/react";
import { useTheme } from "next-themes";
import StarRating from "@/components/starrating/starRating"
import { useState } from "react";
import { Button } from "@heroui/react";
import { Link } from "@heroui/react";

export default function ReviewList() {
  const { resolvedTheme } = useTheme();
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Meat");

  // ✅ 추천 안주 데이터
  const recommendations = {
    Meat: {
      image: "https://heroui.com/images/hero-card-complete.jpeg",
      description: "육류와 잘 어울리는 스테이크는 와인의 풍미를 더욱 돋보이게 합니다.",
    },
    "Sea Food": {
      image: "https://heroui.com/images/hero-card-complete.jpeg",
      description: "신선한 해산물과 함께하는 안주는 와인과 환상적인 조화를 이룹니다.",
    },
    Fried: {
      image: "https://heroui.com/images/hero-card-complete.jpeg",
      description: "바삭한 튀김류는 와인의 산뜻한 맛과 잘 어울립니다.",
    },
    Snack: {
      image: "https://heroui.com/images/hero-card-complete.jpeg",
      description: "간단한 스낵류는 가벼운 와인과 함께 즐기기 좋습니다.",
    },
  };

  // ✅ 리뷰 데이터
  const reviews = [
    {
      id: 1,
      user: "동재재재",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      description: "와인 애호가",
      comment: "와인과 잘 어울리는 풍미가 최고였어요!",
    },
    {
      id: 2,
      user: "지창창",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      description: "술 마스터",
      comment: "진한 맛과 향이 정말 만족스러웠습니다.",
    },
    {
      id: 3,
      user: "승훈훈",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      description: "초보 와인러",
      comment: "무난한 맛이었어요. 가성비 괜찮네요!",
    },
  ];

  // ✅ 탭 구성
  const tabs = [
    {
      id: "review",
      label: "평가 & 리뷰",
      content: (
        <>
          {reviews.map((review) => (
            <Card key={review.id} className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"} p-4 mb-4`}>
              <CardBody>
                <div className="flex justify-between items-center">
                  <User
                    avatarProps={{ src: review.avatar }}
                    name={review.user}
                    description={review.description}
                  />
                  <StarRating totalStars={5} onChange={(value) => setSelectedRating(value)} />
                </div>
                <p className="text-sm mt-4">{review.comment}</p>
              </CardBody>
            </Card>
          ))}

          <div className="flex justify-center mt-4">
            <Link
              href="/"
              isBlock
              showAnchorIcon
              className="text-blue-500 hover:underline text-xs"
            >
              다른 리뷰 더보기
            </Link>
          </div>
        </>
      ),
    },
    {
      id: "recommend",
      label: "추천 안주",
      content: (
        <Card className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"} p-1`}>
          <CardBody>
            <div className="flex justify-between space-x-2 mb-4">
              {Object.keys(recommendations).map((category) => (
                <Button
                  key={category}
                  size="sm"
                  radius="sm"
                  className={`${selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                    } transition duration-300`}
                  onPress={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <img
                src={recommendations[selectedCategory].image}
                alt={selectedCategory}
                className="w-24 h-24 rounded-md"
              />
              <p className="text-sm">{recommendations[selectedCategory].description}</p>
            </div>
          </CardBody>
        </Card>
      ),
    },
    {
      id: "highball",
      label: "하이볼 레시피",
      content: (
        <>
          <Card className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"} p-1`}>
            <CardBody>
              <h4 className="font-semibold text-lg">🍹 기본 하이볼 레시피</h4>
              <p>1. 잔에 얼음을 가득 채우세요.</p>
              <p>2. 위스키 50ml를 붓습니다.</p>
              <p>3. 탄산수 150ml를 천천히 부어줍니다.</p>
              <p>4. 레몬 슬라이스로 장식하세요.</p>
            </CardBody>
          </Card>
          <div className="flex justify-center mt-4">
            <Link
              href="/"
              isBlock
              showAnchorIcon
              className="text-blue-500 hover:underline text-xs"
            >
              전체 레시피 보기
            </Link>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col p-1 rounded-md shadow-md">
      <Tabs aria-label="Dynamic tabs" items={tabs} fullWidth>
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {item.content}
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
