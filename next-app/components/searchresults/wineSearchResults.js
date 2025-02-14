"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardBody, CardFooter, Image, Spinner } from "@heroui/react";

export default function WineSearchResultsPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("query");
  const router = useRouter();

  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(0);
  const size = 10;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const fetchResults = useCallback(
    async (pageNumber) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/v1/alcohols/wines/search?keyword=${encodeURIComponent(
            keyword
          )}&page=${pageNumber}&size=${size}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const fetchedResults = data.content || [];

        if (pageNumber === 0) {
          setSearchResults(fetchedResults);
        } else {
          setSearchResults((prev) => [...prev, ...fetchedResults]);
        }

        setHasMore(fetchedResults.length === size);
      } catch (error) {
        console.error("[API 호출 오류]:", error);
        setHasMore(false);
      }
      setLoading(false);
    },
    [keyword]
  );

  useEffect(() => {
    setPage(0);
    fetchResults(0);
  }, [keyword, fetchResults]);

  const loadMoreItems = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResults(nextPage);
    }
  }, [loading, hasMore, page, fetchResults]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMoreItems();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMoreItems, loading, hasMore]);

  const handleCardClick = (id) => {
    console.log(`[카드 클릭]: ID = ${id}`);
    router.push(`/wine-details/${id}`);
  };

  return (
    <div className="px-2">
      <h1 className="text-md text-center mb-4">
        <b>{keyword}</b>에 대한 검색 결과: {searchResults.length}건
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {searchResults.map((result) => (
          <Card isPressable onPress={() => handleCardClick(result.id)} key={result.id} className="pt-2 flex justify-center">
            <CardBody className="overflow-visible pb-0">
              <Image
                isZoomed
                shadow="sm"
                alt={result.name}
                className="object-cover rounded-xl"
                src={result.image || "/LOGO4.png"}
                width={270}
              />
            </CardBody>
            <CardFooter className="flex flex-col justify-center">
              <p className="font-bold text-md">{result.korName}</p>
              <p className="text-default-400 text-sm">{result.origin}</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div ref={loaderRef} className="h-10 flex justify-center items-center mt-4">
        {loading && <Spinner />}
        {!loading && searchResults.length === 0 && (
          <p className="text-center text-gray-500 text-lg">
            검색 결과가 없습니다.
          </p>
        )}
      </div>

    </div>
  );
}
