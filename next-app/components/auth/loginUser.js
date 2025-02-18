"use client";
import { useState, useEffect } from "react";
import { Spinner, User } from "@heroui/react";
import axios from "axios";

export default function LoginUser({ userId }) {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/api/v1/auth/user/${userId}`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data");
      });
  }, [userId]);

  if (error) return <div>{error}</div>;
  if (!userData) return <Spinner/>;

  return (
    <User
        avatarProps={{src: userData.profileImageUri}}
        description={userData.email}
        name={userData.name}
    />
  );
}
