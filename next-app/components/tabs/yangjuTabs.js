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
import ReviewCard from "@/components/review/reviewcard";

export default function YangjuTabs({ product, productCategory, productId }) {
  const { resolvedTheme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [highballRecipe, setHighballRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [errorRecipe, setErrorRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReview, setLoadingReview] = useState(false);
  const [errorReview, setErrorReview] = useState(null);

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

  // 탭에 들어갈 내용 정의
  const tabs = [
    {
      id: "review",
      label: "평가 & 리뷰",
      content: (
        <>
          {loadingReview ? (
            <div className="py-4 text-center">
              <Spinner />
            </div>
          ) : errorReview ? (
            <div className="py-4 text-center text-red-500">
              {errorReview}
            </div>
          ) : reviews &&
            Array.isArray(reviews) &&
            reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <ReviewCard
                  key={review.id}
                  session={session}
                  review={review}
                  resolvedTheme={resolvedTheme}
                />
              ))}
            </div>
          ) : (
            <div className="py-4 text-center">
              리뷰가 없습니다.
            </div>
          )}

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
      content: <PairingCard
        alcohol={product}
       />,
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
