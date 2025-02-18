"use client";

import { useEffect, useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { User, Button, Link } from "@heroui/react";
import { useTheme } from "next-themes";
import { Spinner } from "@heroui/spinner";
import StarRating from "@/components/starrating/starRating";
import PairingCard from "@/components/cards/pairingCard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RecipeCard from "@/components/highball/recipeCard";

export default function YangjuTabs({ productCategory, productId }) {
  const { resolvedTheme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [highballRecipe, setHighballRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [errorRecipe, setErrorRecipe] = useState(null);

  // 하이볼 레시피 불러오기
  useEffect(() => {
    if (!productCategory) return;
    setLoadingRecipe(true);

    async function fetchHighballRecipe() {
      try {
        const categoryParam = encodeURIComponent(productCategory);
        const res = await fetch(`/api/v1/highball/category?category=${categoryParam}`);

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

  // 리뷰 데이터
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

  // 탭에 들어갈 내용 정의
  const tabs = [
    {
      id: "review",
      label: "평가 & 리뷰",
      content: (
        <>
          {reviews.map((review) => (
            <Card
              key={review.id}
              className={`${resolvedTheme === "dark" ? "bg-content1" : "bg-white"
                } p-4 mb-4`}
            >
              <CardBody>
                <div className="flex justify-between items-center">
                  <User
                    avatarProps={{ src: review.avatar }}
                    name={review.user}
                    description={review.description}
                  />
                  {/* 읽기 전용 별점 표시 */}
                  <StarRating totalStars={5} readOnly />
                </div>
                <p className="text-sm mt-4">{review.comment}</p>
              </CardBody>
            </Card>
          ))}
          <div className="flex justify-center mt-4">
            <Link
              isBlock
              showAnchorIcon
              className="text-blue-500 hover:underline text-sm"
              onPress={() => {
                router.push(`/reviews?category=${productCategory}&drinkId=${productId}`);
              }}
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
      content: <PairingCard />,
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
            <div className="py-4 text-center text-red-500">
              {errorRecipe}
            </div>
          ) : highballRecipe &&
            Array.isArray(highballRecipe) &&
            highballRecipe.length > 0 ? (
            <div className="space-y-4">
              {highballRecipe.slice(0, 3).map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  item={recipe}
                  session={session}
                  resolvedTheme={resolvedTheme}
                />
              ))}
            </div>
          ) : (
            <div className="py-4 text-center">
              레시피가 없습니다.
            </div>
          )}
          <div className="flex justify-center mt-4">
            <Link
              isBlock
              showAnchorIcon
              className="text-blue-500 hover:underline text-sm"
              onPress={() => {
                router.push(`/highballs?category=${productCategory}`);
              }}
            >
              전체 레시피 보기
            </Link>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col p-1">
      <Tabs aria-label="Dynamic tabs" className="mt-0" fullWidth>
        {tabs.map((item) => (
          <Tab key={item.id} title={item.label}>
            {item.content}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
