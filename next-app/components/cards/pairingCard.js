// "use client";

// import { Card, CardBody } from "@heroui/card";
// import { Button, Image, Skeleton } from "@heroui/react";
// import { useTheme } from "next-themes";
// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";

// import { useRef } from "react";

// const PairingCard = ({ alcohol }) => {
//   const { resolvedTheme } = useTheme();
//   const [selectedCategory, setSelectedCategory] = useState("Meat");
//   const [alcoholCate, setAlcoholCate] = useState("");
//   const [isPairingLoading, setIsPairingLoading] = useState(true);
//   const [isThumbnailLoading, setIsThumbnailLoading] = useState(true);
//   const [pairingData, setPairingData] = useState(null);
//   const [youtubeLink, setYoutubeLink] = useState("");
//   const categories = ["Meat", "Sea Food", "Fried", "Snack"];

//   // AbortController를 위한 ref 생성
//   const pairingAbortControllerRef = useRef(null);

//   // alcohol 객체의 tanin 유무에 따라 양주/와인 결정
//   useEffect(() => {
//     if (alcohol && Object.prototype.hasOwnProperty.call(alcohol, "tanin")) {
//       setAlcoholCate("wine");
//     } else {
//       setAlcoholCate("yangju");
//     }
//   }, [alcohol]);

//   // fetchYoutubeLink도 useCallback으로 감싸서 안정적인 참조를 유지
//   const fetchYoutubeLink = useCallback(async (dishName) => {
//     setIsThumbnailLoading(true);
//     try {
//       const ytResponse = await axios.get("/api/v1/pairing/shorts/search", {
//         params: { dish: dishName + " 레시피" },
//       });
//       setYoutubeLink(ytResponse.data.result);
//     } catch (error) {
//       if (axios.isCancel(error)) {
//         console.log("YouTube 요청이 취소되었습니다.");
//       } else {
//         console.error("Failed to fetch YouTube link:", error);
//       }
//     } finally {
//       setIsThumbnailLoading(false);
//     }
//   }, []);

//   const fetchPairing = useCallback(async (selectedCategory, category) => {
//     if (pairingAbortControllerRef.current) {
//       pairingAbortControllerRef.current.abort();
//     }

//     const controller = new AbortController();
//     pairingAbortControllerRef.current = controller;

//     const pairingDataRequest = { ...alcohol, category: selectedCategory };
//     setIsPairingLoading(true);
//     setIsThumbnailLoading(true);
//     setPairingData(null);

//     try {
//       const endpoint = category === "yangju" ? "/api/v1/pairing/yangju" : "/api/v1/pairing/wine";
//       const response = await axios.post(endpoint, pairingDataRequest, {
//         signal: controller.signal, // AbortController의 signal 사용
//       });

//       setPairingData(response.data.data);
//       setIsPairingLoading(false);

//       if (response.data.data && response.data.data.dish_name) {
//         fetchYoutubeLink(response.data.data.dish_name);
//       } 

//     } catch (error) {
//       if (axios.isCancel(error)) {
//         console.log("Pairing 요청이 취소되었습니다.");
//       } else {
//         console.error("Failed to fetch recommendation:", error);
//       }
//     }


//   }, [alcohol, fetchYoutubeLink]);

//   useEffect(() => {
//     if (!alcoholCate) return;
//     fetchPairing(selectedCategory, alcoholCate);
//   }, [selectedCategory, fetchPairing, alcoholCate]);

//   const getYoutubeThumbnailFromLink = (link) => {
//     if (!link) return "";
//     const parts = link.split("/");
//     const videoId = parts[parts.length - 1];
//     return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
//   };

//   const thumbnailUrl = getYoutubeThumbnailFromLink(youtubeLink);

//   useEffect(() => {
//     return () => {
//       if (pairingAbortControllerRef.current) {
//         pairingAbortControllerRef.current.abort();
//       }
//     };
//   }, []);

//   return (
//     <Card className={`${resolvedTheme === "dark" ? "bg-content1" : "bg-white"}`}>
//       <CardBody>
//         <div className="flex justify-evenly space-x-2 mb-4">
//           {categories.map((category) => (
//             <Button
//               key={category}
//               size="sm"
//               radius="sm"
//               className={`${selectedCategory === category
//                 ? "bg-primary text-white"
//                 : "bg-gray-200 text-black"
//                 } transition duration-300`}
//               onPress={() => setSelectedCategory(category)}
//             >
//               {category}
//             </Button>
//           ))}
//         </div>
//         <div className="flex items-center space-x-4">
//           <div className="flex-shrink-0">
//             {isThumbnailLoading ? (
//               <Skeleton className="w-24 h-40 rounded-xl" />
//             ) : youtubeLink ? (
//               <a
//                 href={youtubeLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="relative block"
//               >
//                 <Image
//                   src={thumbnailUrl}
//                   alt="YouTube Thumbnail"
//                   className="w-24 h-40 rounded-md object-cover"
//                 />
//                 <div className="absolute inset-0 flex items-center justify-center z-10">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-10 h-10 text-white opacity-80"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                   >
//                     <path d="M8 5v14l11-7z" />
//                   </svg>
//                 </div>
//               </a>
//             ) : (
//               <div className="w-24 h-24 bg-gray-300 rounded-md" />
//             )}
//           </div>
//           <div className="w-full">
//             {isPairingLoading ? (
//               <>
//                 <Skeleton className="rounded-xl w-24 h-4" />
//                 <Skeleton className="rounded-xl w-36 h-4 mt-2" />
//                 <Skeleton className="rounded-xl w-36 h-4 mt-2" />
//                 <Skeleton className="rounded-xl w-24 h-4 mt-4" />
//                 <ul className="mt-2 list-disc pl-2">
//                   <Skeleton className="rounded-xl w-26 h-4 mt-1" />
//                   <Skeleton className="rounded-xl w-26 h-4 mt-1" />
//                 </ul>
//               </>
//             ) : pairingData ? (
//               <>
//                 <p className="text-sm font-bold">{pairingData.dish_name}</p>
//                 <p className="text-sm">{pairingData.description}</p>
//                 {pairingData.side_dish && pairingData.side_dish.length > 0 && (
//                   <>
//                     <p className="mt-2 text-sm font-bold">곁들임 요리</p>
//                     <ul className="mt-2 list-disc pl-4">
//                       {pairingData.side_dish.map((item, index) => (
//                         <li key={index} className="text-sm">
//                           {item}
//                         </li>
//                       ))}
//                     </ul>
//                   </>
//                 )}
//               </>
//             ) :
//               (<p className="text-sm">추천 결과가 없습니다.</p>)
//             }
//           </div>
//         </div>
//       </CardBody>
//     </Card>
//   );
// };

// export default PairingCard;


"use client";

import { Card, CardBody } from "@heroui/card";
import { Button, Image } from "@heroui/react";
import { useTheme } from "next-themes";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import LoadingAnimation from "@/components/cards/loadingAnimation";

const PairingCard = ({ alcohol }) => {
  const { resolvedTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("Meat"); // ✅ 기본값을 'Meat'로 설정
  const [alcoholCate, setAlcoholCate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pairingData, setPairingData] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const categories = ["Meat", "Sea Food", "Fried", "Snack"];

  const pairingAbortControllerRef = useRef(null);

  useEffect(() => {
    if (alcohol && Object.prototype.hasOwnProperty.call(alcohol, "tanin")) {
      setAlcoholCate("wine");
    } else {
      setAlcoholCate("yangju");
    }
  }, [alcohol]);

  const fetchYoutubeLink = useCallback(async (dishName) => {
    try {
      const ytResponse = await axios.get("/api/v1/pairing/shorts/search", {
        params: { dish: dishName + " 레시피" },
      });
      setYoutubeLink(ytResponse.data.result);
    } catch (error) {
      console.error("Failed to fetch YouTube link:", error);
    }
  }, []);

  const fetchPairing = useCallback(async (category, alcoholCategory) => {
    if (pairingAbortControllerRef.current) {
      pairingAbortControllerRef.current.abort();
    }

    const controller = new AbortController();
    pairingAbortControllerRef.current = controller;

    setIsLoading(true);
    setPairingData(null);
    setYoutubeLink("");

    try {
      const endpoint = alcoholCategory === "yangju" ? "/api/v1/pairing/yangju" : "/api/v1/pairing/wine";
      const response = await axios.post(endpoint, { ...alcohol, category }, {
        signal: controller.signal,
      });

      setPairingData(response.data.data);

      if (response.data.data && response.data.data.dish_name) {
        await fetchYoutubeLink(response.data.data.dish_name);
      }
    } catch (error) {
      console.error("Failed to fetch recommendation:", error);
    } finally {
      setIsLoading(false);
    }
  }, [alcohol, fetchYoutubeLink]);

  useEffect(() => {
    if (alcoholCate) {
      fetchPairing("Meat", alcoholCate); // ✅ 기본값 'Meat'로 API 요청
    }
  }, [alcoholCate, fetchPairing]);

  const getYoutubeThumbnailFromLink = (link) => {
    if (!link) return "";
    const videoId = link.split("/").pop();
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const thumbnailUrl = getYoutubeThumbnailFromLink(youtubeLink);

  useEffect(() => {
    return () => {
      if (pairingAbortControllerRef.current) {
        pairingAbortControllerRef.current.abort();
      }
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
                } transition duration-300 flex-1`}
              onPress={() => {
                setSelectedCategory(category);
                fetchPairing(category, alcoholCate);
              }}
            >
              {category}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {youtubeLink ? (
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
                  <div className="absolute inset-0 flex items-center justify-center z-10">
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
                <div className="w-24 h-24 bg-gray-300 rounded-md" />
              )}
            </div>

            <div className="w-full flex flex-col">
              {pairingData ? (
                <>
                  <p className="text-lg font-bold">{pairingData.dish_name}</p>
                  <p className="text-sm text-gray-600">{pairingData.description}</p>
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
                <p className="text-sm text-gray-500">추천 결과가 없습니다.</p>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PairingCard;
