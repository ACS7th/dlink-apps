// "use client";
// import { useState, useEffect } from "react";
// import { Spinner, User } from "@heroui/react";
// import axios from "axios";

// export default function LoginUser({ userId }) {
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!userId) return;

//     axios
//       .get(`/api/v1/auth/user/${userId}`)
//       .then((res) => {
//         setUserData(res.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching user data:", err);
//         setError("Failed to fetch user data");
//       });
//   }, [userId]);

//   if (error) return <div>{error}</div>;
//   if (!userData) return <Spinner/>;

//   return (
//     <User
//         avatarProps={{src: userData.profileImageUri}}
//         description={userData.email}
//         name={userData.name}
//     />
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { Spinner, User } from "@heroui/react";
import axios from "axios";

export default function LoginUser({ userId }) {
  const [userData, setUserData] = useState(null);

  // 기본 사용자 정보 (조회 실패 시 fallback)
  const defaultUserData = {
    name: "익명",
    email: "일반회원",
    profileImageUri: "/favicon.ico",
  };

  useEffect(() => {
    // userId가 없으면 바로 기본값 설정
    if (!userId) {
      setUserData(defaultUserData);
      return;
    }

    axios
      .get(`/api/v1/auth/user/${userId}`)
      .then((res) => {
        // API에서 데이터가 있을 경우 해당 데이터를 사용, 없으면 기본값 사용
        if (res.data) {
          setUserData(res.data);
        } else {
          setUserData(defaultUserData);
        }
      })
      .catch((err) => {
        console.error("사용자 데이터 조회 에러:", err);
        setUserData(defaultUserData);
      });
  }, [userId]);

  if (!userData) return <Spinner />;

  return (
    <User
      avatarProps={{ src: userData.profileImageUri }}
      description={userData.email}
      name={userData.name}
    />
  );
}
