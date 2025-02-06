"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";
import NextImage from "next/image";
import { Alert } from "@heroui/alert";
import ImageUploadButton from "@/components/buttons/imageUploadButton";

export default function Content() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // 📌 검색 버튼 클릭 (경고 알람)
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 1000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-150px)]">
      {/* 로고 */}
      <NextImage src="/LOGO2.png" alt="logo" width={300} height={300} />

      {/* 검색바, 검색 버튼, 이미지 업로드 버튼을 한 줄로 배치 */}
      <div className="flex w-full max-w-md-23 space-x-2 items-center">
        {/* 검색 입력창 */}
        <Input
          className="flex-1"
          placeholder="검색하고 싶은 주류를 입력하세요."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
              console.log("검색어:", searchQuery);
            }
          }}
        />

        {/* 검색 버튼 */}
        <Button
          color="primary"
          className="bg-red-900"
          isIconOnly
          onPress={handleSearch}
        >
          <NextImage src="/search2.svg" alt="search" width={24} height={24} />
        </Button>

        {/* 이미지 업로드 버튼 */}
        <ImageUploadButton />
      </div>

      {/* 검색어 미입력 알림 */}
      {showAlert && (
        <div className="alert-container mt-3">
          <Alert color="warning" title="검색어 미입력" />
        </div>
      )}
    </div>
  );
}
