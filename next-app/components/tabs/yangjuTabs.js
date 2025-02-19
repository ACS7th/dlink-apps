"use client";

import { useEffect, useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Spinner } from "@heroui/spinner";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Link } from "@heroui/react";
import ReviewCard from "@/components/review/reviewcard";
import PairingCard from "@/components/cards/pairingCard";
import RecipeCard from "@/components/highball/recipeCard";

export default function YangjuTabs({ product, productCategory, productId }) {
  const { resolvedTheme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();

  const category = productCategory;
  const drinkId = productId;

  const [highballRecipe, setHighballRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [errorRecipe, setErrorRecipe] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [loadingReview, setLoadingReview] = useState(false);
  const [errorReview, setErrorReview] = useState(null);

  // 하이볼 레시피 불러오기
  useEffect(() => {
    if (!category) return;
    setLoadingRecipe(true);
    async function fetchHighballRecipe() {
      try {
        const categoryParam = encodeURIComponent(category);
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
  }, [category]);

  // 리뷰 목록 불러오기 
  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoadingReview(true);
        const res = await fetch(
          `/api/v1/reviews/search?category=${category}&drinkId=${drinkId}`
        );
        if (!res.ok) {
          throw new Error(`리뷰 목록을 불러오지 못했습니다. 서버 응답 코드: ${res.status}`);
        }
        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
          console.warn("🚨 리뷰 데이터가 비어있습니다.");
          setReviews([]);
          return;
        }
        // 응답 객체를 배열로 변환 (각 리뷰의 key 값을 writeUser 및 id로 설정)
        const transformedReviews = Object.entries(data).map(
          ([userId, review]) => ({
            ...review,
            writeUser: userId,
            id: userId,
          })
        );
        setReviews(transformedReviews);
      } catch (error) {
        console.error("❌ 리뷰 불러오기 실패:", error.message);
        setReviews([]);
        setErrorReview(error.message);
      } finally {
        setLoadingReview(false);
      }
    }
    if (category && drinkId) {
      fetchReviews();
    }
  }, [category, drinkId]);

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
          ) : reviews && reviews.length > 0 ? (
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
                router.push(`/reviews?category=${category}&drinkId=${drinkId}`);
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
                router.push(`/highballs?category=${category}`);
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
