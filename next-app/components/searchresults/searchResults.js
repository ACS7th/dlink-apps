// [api 버전?]
// "use client";

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";

// export default function SearchResultsPage() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get("query");
//   const [searchResults, setSearchResults] = useState([]);

//   useEffect(() => {
//     if (query) {
//       // 데이터 가져오기 (API 호출)
//       fetch(`/api/search?query=${encodeURIComponent(query)}`)
//         .then((res) => res.json())
//         .then((data) => setSearchResults(data.results))
//         .catch((err) => console.error(err));
//     }
//   }, [query]);

//   return (
//     <div className="p-4">
//       {/* 상단 검색 결과 정보 */}
//       <h1 className="text-xl font-bold text-center mb-4 text-gray-800">
//         [{query}]에 대한 검색 결과: {searchResults.length}건
//       </h1>

//       {/* 검색 결과 그리드 */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {searchResults.map((result, index) => (
//           <div
//             key={index}
//             className="border border-gray-300 rounded-xl p-4 shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center"
//           >
//             <Image
//               src={result.imageUrl || "/default-bottle.png"} // 기본 이미지 처리
//               alt={result.name}
//               width={150}
//               height={200}
//               className="rounded-md border border-gray-400"
//             />
//             <h2 className="text-center text-lg font-semibold mt-3 text-gray-700">
//               {result.name}
//             </h2>
//           </div>
//         ))}
//       </div>

//       {/* 검색 결과 없을 경우 */}
//       {searchResults.length === 0 && (
//         <p className="text-center text-gray-500 mt-5 text-lg">
//           검색 결과가 없습니다.
//         </p>
//       )}
//     </div>
//   );
// }

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const router = useRouter();

  const [searchResults, setSearchResults] = useState([
    { id: 1, name: "Ballentine 17", imageUrl: "/default-bottle.png" },
    { id: 2, name: "Ballentine 21", imageUrl: "/default-bottle.png" },
    { id: 3, name: "Ballentine 30", imageUrl: "/default-bottle.png" },
    { id: 4, name: "Ballentine 50", imageUrl: "/default-bottle.png" },
    { id: 5, name: "Ballentine Special", imageUrl: "/default-bottle.png" },
    { id: 6, name: "Ballentine Gold", imageUrl: "/default-bottle.png" },
    { id: 7, name: "Ballentine Reserve", imageUrl: "/default-bottle.png" },
    { id: 8, name: "Ballentine Classic", imageUrl: "/default-bottle.png" },
    { id: 9, name: "Ballentine Rare", imageUrl: "/default-bottle.png" },
    { id: 10, name: "Ballentine Limited", imageUrl: "/default-bottle.png" },
  ]);

  const [visibleItems, setVisibleItems] = useState(10);
  const loaderRef = useRef(null);

  const loadMoreItems = useCallback(() => {
    setVisibleItems((prev) => prev + 10);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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
  }, [loadMoreItems]);

  const handleCardClick = (id) => {
    router.push(`/details/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center mb-4 text-gray-800">
        "{query}"에 대한 {searchResults.length}건의 검색 결과 입니다.
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchResults.slice(0, visibleItems).map((result, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-xl p-4 shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center cursor-pointer"
            onClick={() => handleCardClick(result.id)}
          >
            <Image
              src={result.imageUrl}
              alt={result.name}
              width={150}
              height={200}
              className="rounded-md border border-gray-400"
            />
            <h2 className="text-center text-lg font-semibold mt-3 text-gray-700">
              {result.name}
            </h2>
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="h-10 flex justify-center items-center">
        {visibleItems < searchResults.length && <p>로딩 중...</p>}
      </div>

      {searchResults.length === 0 && (
        <p className="text-center text-gray-500 mt-6 text-lg">
          검색 결과가 없습니다.
        </p>
      )}
    </div>
  );
}

