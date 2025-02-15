"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { User } from "@heroui/react";
import { useTheme } from "next-themes";
import StarRating from "@/components/starrating/starRating";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Link } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import PairingCard from "@/components/cards/pairingCard";

export default function YangjuTabs({ productCategory }) {
  const { resolvedTheme } = useTheme();
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Meat");

  // 하이볼 레시피 관련 상태
  const [highballRecipe, setHighballRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [errorRecipe, setErrorRecipe] = useState(null);

  // productCategory 값이 변경될 때마다 해당 카테고리의 하이볼 레시피를 호출
  useEffect(() => {
    if (!productCategory) return;
    setLoadingRecipe(true);
    async function fetchHighballRecipe() {
      try {
        const res = await fetch(
          `/api/v1/highball/category?category=${encodeURIComponent(productCategory)}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setHighballRecipe(data);
      } catch (error) {
        console.error("하이볼 레시피 호출 오류:", error);
        setErrorRecipe("하이볼 레시피를 불러오지 못했습니다.");
      } finally {
        setLoadingRecipe(false);
      }
    }
    fetchHighballRecipe();
  }, [productCategory]);

  const recommendations = {
    Meat: {
      image: "https://heroui.com/images/hero-card-complete.jpeg",
      description:
        "육류와 잘 어울리는 스테이크는 와인의 풍미를 더욱 돋보이게 합니다.",
    },
    "Sea Food": {
      image: "https://heroui.com/images/hero-card-complete.jpeg",
      description:
        "신선한 해산물과 함께하는 안주는 와인과 환상적인 조화를 이룹니다.",
    },
    Fried: {
      image: "https://heroui.com/images/hero-card-complete.jpeg",
      description:
        "바삭한 튀김류는 와인의 산뜻한 맛과 잘 어울립니다.",
    },
    Snack: {
      image: "https://heroui.com/images/hero-card-complete.jpeg",
      description:
        "간단한 스낵류는 가벼운 와인과 함께 즐기기 좋습니다.",
    },
  };

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

  const tabs = [
    {
      id: "review",
      label: "평가 & 리뷰",
      content: (
        <>
          {reviews.map((review) => (
            <Card key={review.id} className={`${resolvedTheme === "dark" ? "bg-content1" : "bg-white"} p-4 mb-4`}>
              <CardBody>
                <div className="flex justify-between items-center">
                  <User
                    avatarProps={{ src: review.avatar }}
                    name={review.user}
                    description={review.description}
                  />
                  <StarRating
                    totalStars={5}
                    onChange={(value) => setSelectedRating(value)}
                    readOnly
                  />
                </div>
                <p className="text-sm mt-4">{review.comment}</p>
              </CardBody>
            </Card>
          ))}

          <div className="flex justify-center mt-4">
            <Link
              href="/reviewlists"
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
        <PairingCard />
      ),
    },
    {
      id: "highball",
      label: "하이볼 레시피",
      content: (
        <>
          {loadingRecipe ? (
            <div className="py-4 text-center">
              <Spinner />
            </div>
          ) : errorRecipe ? (
            <div className="py-4 text-center text-red-500">{errorRecipe}</div>
          ) : highballRecipe &&
            Array.isArray(highballRecipe) &&
            highballRecipe.length > 0 ? (
            <div className="space-y-4">load           {highballRecipe.slice(0, 3).map((recipe) => (
                <Card
                  key={recipe.id}
                  className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"} p-1`}
                >
                  <CardBody>
                    <h4 className="font-semibold text-lg">
                      🍹 {recipe.engName} ({recipe.korName})
                    </h4>
                    {/* 만드는 법 */}
                    <p className="mb-2">{recipe.making}</p>
                    {/* 재료 목록 */}
                    {recipe.ingredients && (
                      <div>
                        <h5 className="font-medium mb-1">재료</h5>
                        <ul className="list-disc pl-5">
                          {Object.entries(recipe.ingredients).map(([key, value]) => (
                            <li key={key}>{value}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center">
              <Card>
                <CardBody
                  className="flex items-center justify-center">
                  레시피가 없습니다.
                </CardBody>
              </Card>
            </div>
          )}
          <div className="flex justify-center mt-4">
            <Link
              href="/recipes"
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
    <div className="flex w-full flex-col p-1 ">
      <Tabs aria-label="Dynamic tabs" className="mt-0" items={tabs} fullWidth>
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {item.content}
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
