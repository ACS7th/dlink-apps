"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { User } from "@heroui/react";
import { useTheme } from "next-themes";

// ✅ 최종 컴포넌트
export default function ReviewList() {
  const { setTheme, resolvedTheme } = useTheme();

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
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className={`p-4 rounded-md shadow-md ${resolvedTheme === 'dark' ? 'bg-red-900' : null} `}>
              <User
                avatarProps={{ src: review.avatar }}
                name={review.user}
                description={review.description}
              />
              <p className="text-sm mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "recommend",
      label: "추천 안주",
      content: (
        <div className="p-4">
          <ul className="list-disc ml-5 text-gray-800">
            <li>치즈 플래터 🧀</li>
            <li>과일 샐러드 🍇🍓</li>
            <li>훈제 연어와 아보카도 🥑</li>
          </ul>
        </div>
      ),
    },
    {
      id: "highball",
      label: "하이볼 레시피",
      content: (
        <div className="p-4 space-y-2">
          <h4 className="font-semibold text-lg">🍹 기본 하이볼 레시피</h4>
          <p>1. 잔에 얼음을 가득 채우세요.</p>
          <p>2. 위스키 50ml를 붓습니다.</p>
          <p>3. 탄산수 150ml를 천천히 부어줍니다.</p>
          <p>4. 레몬 슬라이스로 장식하세요.</p>
        </div>
      ),
    },
  ];


  return (
    <div className="flex w-full flex-col p-4 rounded-md shadow-md">
      <Tabs aria-label="Dynamic tabs" items={tabs}>
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <Card>
              <CardBody>{item.content}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
