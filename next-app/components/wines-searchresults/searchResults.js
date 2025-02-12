"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Spinner } from "@heroui/react";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("query");
  const router = useRouter();

  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const size = 10;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  // API를 호출하여 데이터를 불러오는 함수
  const fetchResults = useCallback(
    async (pageNumber) => {
      console.log(`[API 호출] 페이지: ${pageNumber}, 키워드: ${keyword}`);
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

        // 데이터 로그 출력
        console.log("[API 응답 데이터]:", fetchedResults);

        // 첫 페이지면 새로 세팅, 그 이후 페이지면 기존 결과에 추가
        if (pageNumber === 1) {
          setSearchResults(fetchedResults);
        } else {
          setSearchResults((prev) => [...prev, ...fetchedResults]);
        }

        // 반환된 데이터 개수가 size보다 작으면 더 이상 불러올 데이터가 없음
        setHasMore(fetchedResults.length === size);
      } catch (error) {
        console.error("[API 호출 오류]:", error);
      }
      setLoading(false);
    },
    [keyword]
  );

  // 검색어 변경 시 초기 데이터 로드 (page 1)
  useEffect(() => {
    setPage(1);
    fetchResults(1);
  }, [keyword, fetchResults]);

  // 무한 스크롤에 의해 다음 페이지를 불러오는 함수
  const loadMoreItems = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      console.log(`[다음 페이지 로드] 페이지: ${nextPage}`);
      setPage(nextPage);
      fetchResults(nextPage);
    }
  }, [loading, hasMore, page, fetchResults]);

  // Intersection Observer를 사용하여 스크롤 이벤트 감지
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
    router.push(`/yangju-details/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center mb-4">
        "{keyword}"에 대한 검색 결과: {searchResults.length}건
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchResults.map((result) => (
          <div
            key={result.id}
            className="border border-gray-300 rounded-xl p-4 shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center cursor-pointer"
            onClick={() => handleCardClick(result.id)}
          >
            <Image
              src={result.image || "@/public/LOGE.png"}
              alt={result.name}
              width={150}
              height={200}
              className="rounded-md border border-gray-400"
            />
            <h2 className="text-center text-sm font-semibold mt-3">
              {result.korName}
            </h2>
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="h-10 flex justify-center items-center mt-6">
        {loading && <Spinner />}
        {!loading && hasMore && <p>더 많은 결과를 불러오는 중...</p>}
      </div>

      {!loading && searchResults.length === 0 && (
        <p className="text-center text-gray-500 mt-6 text-lg">
          검색 결과가 없습니다.
        </p>
      )}
    </div>
  );
}
