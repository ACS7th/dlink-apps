// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState, useRef, useCallback } from "react";
// import { Card, CardBody, CardFooter, Image, Spinner, Tooltip } from "@heroui/react";

// export const dynamic = 'force-dynamic';

// export default function YangjuResultsPage({ setTabKey }) {
//   const searchParams = useSearchParams();
//   const keyword = searchParams.get("query");
//   const router = useRouter();

//   const [searchResults, setSearchResults] = useState([]);
//   const [page, setPage] = useState(0);
//   const size = 10;
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const loaderRef = useRef(null);

//   const fetchResults = useCallback(
//     async (pageNumber) => {
//       console.log(`[API 호출] 페이지: ${pageNumber}, 키워드: ${keyword}`);
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `/api/v1/alcohols/yangjus/search?keyword=${encodeURIComponent(
//             keyword
//           )}&page=${pageNumber}&size=${size}`
//         );
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         const data = await res.json();
//         const fetchedResults = data.content || [];

//         if (fetchedResults.length === 0 && pageNumber === 0) {
//           setTabKey("Wine");
//         }

//         if (pageNumber === 0) {
//           setSearchResults(fetchedResults);
//         } else {
//           setSearchResults((prev) => [...prev, ...fetchedResults]);
//         }

//         setHasMore(fetchedResults.length === size);
//       } catch (error) {
//         console.error("[API 호출 오류]:", error);
//       }
//       setLoading(false);
//     },
//     [keyword]
//   );

//   useEffect(() => {
//     setPage(0);
//     fetchResults(0);
//   }, [keyword, fetchResults]);

//   const loadMoreItems = useCallback(() => {
//     if (!loading && hasMore) {
//       const nextPage = page + 1;
//       console.log(`[다음 페이지 로드] 페이지: ${nextPage}`);
//       setPage(nextPage);
//       fetchResults(nextPage);
//     }
//   }, [loading, hasMore, page, fetchResults]);

//   useEffect(() => {
//     const currentLoader = loaderRef.current;
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !loading && hasMore) {
//           loadMoreItems();
//         }
//       },
//       { threshold: 1.0 }
//     );

//     if (currentLoader) {
//       observer.observe(currentLoader);
//     }

//     return () => {
//       if (currentLoader) {
//         observer.unobserve(currentLoader);
//       }
//     };
//   }, [loadMoreItems, loading, hasMore]);


//   const handleCardClick = (id) => {
//     console.log(`[카드 클릭]: ID = ${id}`);
//     router.push(`/yangju-details/${id}`);
//   };

//   return (
//     <div className="px-2">
//       <h1 className="text-md text-center mb-4">
//         <b>{keyword}</b>에 대한 검색 결과: {searchResults.length}건
//       </h1>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
//         {searchResults.map((result) => (
//           <Card isPressable onPress={() => handleCardClick(result.id)} key={result.id} className="pt-2 flex justify-center">
//             <CardBody className="overflow-visible pb-0">
//               <Image
//                 isZoomed
//                 shadow="sm"
//                 alt={result.name}
//                 className="object-cover rounded-xl"
//                 src={result.image || "/LOGO4.png"}
//                 width={270}
//               />
//             </CardBody>
//             <CardFooter className="flex flex-col justify-center">
//               <Tooltip content={result.name}>
//                 <p className="font-bold text-md">{result.korName}</p>
//               </Tooltip>
//               <p className="text-default-400 text-sm">{result.origin}</p>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>

//       <div ref={loaderRef} className="h-10 flex justify-center items-center mt-4">
//         {loading && <Spinner />}
//         {!loading && searchResults.length === 0 && (
//           <p className="text-center text-gray-500 mt-6 text-lg">
//             검색 결과가 없습니다.
//           </p>
//         )}
//       </div>

//     </div>
//   );
// }


"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardBody, CardFooter, Image, Spinner, Tooltip } from "@heroui/react";

export const dynamic = 'force-dynamic';

export default function YangjuResultsPage({ setTabKey, tabKey }) {
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
      console.log(`[API 호출] 페이지: ${pageNumber}, 키워드: ${keyword}`);
      setLoading(true);
      try {
        const res = await fetch(
          `/api/v1/alcohols/yangjus/search?keyword=${encodeURIComponent(keyword)}&page=${pageNumber}&size=${size}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const fetchedResults = data.content || [];

        if (pageNumber === 0) {
          setSearchResults(fetchedResults);

          // ✅ "처음 검색 시"에만 와인 탭으로 자동 변경
          if (fetchedResults.length === 0 && tabKey === "Wine") {
            setTabKey("Wine");
          }
        } else {
          setSearchResults((prev) => [...prev, ...fetchedResults]);
        }

        setHasMore(fetchedResults.length === size);
      } catch (error) {
        console.error("[API 호출 오류]:", error);
      }
      setLoading(false);
    },
    [keyword, tabKey]
  );

  useEffect(() => {
    setPage(0);
    fetchResults(0);
  }, [keyword, fetchResults]);

  const loadMoreItems = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      console.log(`[다음 페이지 로드] 페이지: ${nextPage}`);
      setPage(nextPage);
      fetchResults(nextPage);
    }
  }, [loading, hasMore, page, fetchResults]);

  useEffect(() => {
    const currentLoader = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMoreItems();
        }
      },
      { threshold: 1.0 }
    );

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMoreItems, loading, hasMore]);

  const handleCardClick = (id) => {
    console.log(`[카드 클릭]: ID = ${id}`);
    router.push(`/yangju-details/${id}`);
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
              <Tooltip content={result.name}>
                <p className="font-bold text-md">{result.korName}</p>
              </Tooltip>
              <p className="text-default-400 text-sm">{result.origin}</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div ref={loaderRef} className="h-10 flex justify-center items-center mt-4">
        {loading && <Spinner />}
        {!loading && searchResults.length === 0 && (
          <p className="text-center text-gray-500 mt-6 text-lg">
            검색 결과가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
