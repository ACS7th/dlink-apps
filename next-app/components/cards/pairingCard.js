"use client";

import { Card, CardBody } from "@heroui/card";
import { Button, Image, Skeleton } from "@heroui/react";
import { useTheme } from "next-themes";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const PairingCard = ({ alcohol }) => {
  const { resolvedTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("Meat");
  const [alcoholCate, setAlcoholCate] = useState("wine");
  const [isPairingLoading, setIsPairingLoading] = useState(true);
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(true);
  const [pairingData, setPairingData] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const categories = ["Meat", "Sea Food", "Fried", "Snack"];

  // alcohol 객체의 tanin 유무에 따라 양주/와인 결정
  useEffect(() => {
    if (alcohol && Object.prototype.hasOwnProperty.call(alcohol, "tanin")) {
      setAlcoholCate("yangju");
    } else {
      setAlcoholCate("wine");
    }
  }, [alcohol]);

  // fetchYoutubeLink도 useCallback으로 감싸서 안정적인 참조를 유지
  const fetchYoutubeLink = useCallback(async (dishName) => {
    setIsThumbnailLoading(true);
    try {
      const ytResponse = await axios.get("/api/v1/pairing/shorts/search", {
        params: { dish: dishName + " 레시피" },
      });
      setYoutubeLink(ytResponse.data.result);
    } catch (error) {
      console.error("Failed to fetch YouTube link:", error);
    } finally {
      setIsThumbnailLoading(false);
    }
  }, []);

  // fetchPairing 함수를 useCallback으로 감싸서 의존성 문제 해결
  const fetchPairing = useCallback(async (selectedCategory) => {
    const pairingDataRequest = { ...alcohol, category: selectedCategory };
    setIsPairingLoading(true);
    setIsThumbnailLoading(true);
    setPairingData(null);
    try {
      const endpoint =
        alcoholCate === "yangju" ? "/api/v1/pairing/yangju" : "/api/v1/pairing/wine";
      const response = await axios.post(endpoint, pairingDataRequest);
      console.log("추천 응답:", response.data);
      setPairingData(response.data.data);
      if (response.data.data && response.data.data.dish_name) {
        fetchYoutubeLink(response.data.data.dish_name);
      } else {
        setIsThumbnailLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch recommendation:", error);
    } finally {
      setIsPairingLoading(false);
    }
  }, [alcohol, alcoholCate, fetchYoutubeLink]);

  // 선택된 카테고리나 alcoholCate가 변경될 때 pairing API 호출
  useEffect(() => {
    fetchPairing(selectedCategory);
  }, [selectedCategory, alcoholCate, fetchPairing]);

  const getYoutubeThumbnailFromLink = (link) => {
    if (!link) return "";
    const parts = link.split("/");
    const videoId = parts[parts.length - 1];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const thumbnailUrl = getYoutubeThumbnailFromLink(youtubeLink);

  // 컴포넌트 언마운트 시 상태 초기화
  useEffect(() => {
    return () => {
      setPairingData(null);
      setYoutubeLink("");
      setIsPairingLoading(true);
      setIsThumbnailLoading(true);
    };
  }, []);

  return (
    <Card className={`${resolvedTheme === "dark" ? "bg-content1" : "bg-white"}`}>
      <CardBody>
        <div className="flex justify-evenly space-x-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              radius="sm"
              className={`${selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-black"
                } transition duration-300`}
              onPress={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {isThumbnailLoading ? (
              <Skeleton className="w-24 h-40 rounded-xl" />
            ) : youtubeLink ? (
              <a
                href={youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block"
              >
                <Image
                  src={thumbnailUrl}
                  alt="YouTube Thumbnail"
                  className="w-24 h-40 rounded-md object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-white opacity-80"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </a>
            ) : (
              <div className="w-24 h-40 bg-gray-300 rounded-md" />
            )}
          </div>
          <div className="w-full">
            {isPairingLoading ? (
              <>
                <Skeleton className="rounded-xl w-24 h-4" />
                <Skeleton className="rounded-xl w-36 h-4 mt-2" />
                <Skeleton className="rounded-xl w-36 h-4 mt-2" />
                <Skeleton className="rounded-xl w-24 h-4 mt-4" />
                <ul className="mt-2 list-disc pl-2">
                  <Skeleton className="rounded-xl w-26 h-4 mt-1" />
                  <Skeleton className="rounded-xl w-26 h-4 mt-1" />
                </ul>
              </>
            ) : pairingData ? (
              <>
                <p className="text-sm font-bold">{pairingData.dish_name}</p>
                <p className="text-sm">{pairingData.description}</p>
                {pairingData.side_dish && pairingData.side_dish.length > 0 && (
                  <>
                    <p className="mt-2 text-sm font-bold">곁들임 요리</p>
                    <ul className="mt-2 list-disc pl-4">
                      {pairingData.side_dish.map((item, index) => (
                        <li key={index} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <p className="text-sm">추천 결과가 없습니다.</p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PairingCard;
