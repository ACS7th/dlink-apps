"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { User } from "@heroui/react";
import { useTheme } from "next-themes";
import StarRating from "@/components/starrating/starRating";
import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { Link } from "@heroui/react";
import axios from "axios";
import PairingCard from "../cards/pairingCard";

export default function ReviewList() {
  const { resolvedTheme } = useTheme();
  const [selectedRating, setSelectedRating] = useState(0);
  const [recommendation, setRecommendation] = useState(null);

  const fetchRecommendation = async () => {
    try {
      const response = await axios.get('/api/recommendations');
      setRecommendation(response.data);
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
    }
  };

  useEffect(() => {
    fetchRecommendation();
  }, []);

  const reviews = [
    { id: 1, user: "동재재재", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d", description: "와인 애호가", comment: "와인과 잘 어울리는 풍미가 최고였어요!" },
    { id: 2, user: "지창창", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d", description: "술 마스터", comment: "진한 맛과 향이 정말 만족스러웠습니다." },
    { id: 3, user: "승훈훈", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d", description: "초보 와인러", comment: "무난한 맛이었어요. 가성비 괜찮네요!" }
  ];

  const tabs = [
    {
      id: "review",
      label: "평가 & 리뷰",
      content: (
        <>
          {reviews.map((review) => (
            <Card key={review.id} className={`${resolvedTheme === "dark" ? "bg-primary-800" : "bg-white"} p-4 mb-4`}>
              <CardBody>
                <div className="flex justify-between items-center">
                  <User avatarProps={{ src: review.avatar }} name={review.user} description={review.description} />
                  <StarRating totalStars={5} onChange={setSelectedRating} readOnly />
                </div>
                <p className="text-sm mt-4">{review.comment}</p>
              </CardBody>
            </Card>
          ))}
          <div className="flex justify-center mt-4">
            <Link href="/reviewlists" isBlock showAnchorIcon className="text-blue-500 hover:underline text-xs">
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
        <PairingCard/>
      ),
    }
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
