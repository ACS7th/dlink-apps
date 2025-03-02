// "use client";

// import { useState, useEffect } from "react";

// const LoadingAnimation = () => {
//   const messages = [
//     "추천 안주가 생성 중입니다.",
//     "추천 안주가 곧 완성됩니다..",
//     "맛있는 추천 안주를 준비 중입니다...",
//   ];

//   const [currentMessage, setCurrentMessage] = useState(messages[0]);
//   let messageIndex = 0;

//   useEffect(() => {
//     const interval = setInterval(() => {
//       messageIndex = (messageIndex + 1) % messages.length;
//       setCurrentMessage(messages[messageIndex]);
//     }, 2000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center h-32 space-y-4">
//       <p className="text-lg font-semibold text-gray-600 animate-fade">{currentMessage}</p>

//       <style>
//         {`
//           @keyframes fade {
//             0% { opacity: 0.3; }
//             50% { opacity: 1; }
//             100% { opacity: 0.3; }
//           }

//           .animate-fade {
//             animation: fade 2s infinite ease-in-out;
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default LoadingAnimation;


"use client";

import { useState, useEffect } from "react";

const LoadingAnimation = () => {
  const message = "추천 안주가 생성 중입니다...";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false); // 글자를 지우는 중인지 체크

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100; // 지울 때는 더 빠르게
    const delayBeforeDelete = 1000; // 문장이 완성된 후 유지 시간

    const typingInterval = setTimeout(() => {
      if (!isDeleting && index < message.length) {
        setDisplayText((prev) => prev + message[index]);
        setIndex(index + 1);
      } else if (!isDeleting && index === message.length) {
        setTimeout(() => setIsDeleting(true), delayBeforeDelete); // 일정 시간 유지 후 삭제 시작
      } else if (isDeleting && index > 0) {
        setDisplayText((prev) => prev.slice(0, -1));
        setIndex(index - 1);
      } else {
        setIsDeleting(false); // 삭제가 끝나면 다시 타이핑 시작
      }
    }, typingSpeed);

    return () => clearTimeout(typingInterval);
  }, [index, isDeleting, message]);

  return (
    <div className="flex flex-col items-center justify-center h-32 space-y-4">
      <p className="text-lg font-semibold text-gray-600">{displayText}</p>
    </div>
  );
};

export default LoadingAnimation;

