"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";
import NextImage from "next/image";
import { Alert } from "@heroui/alert";
import ImageUploadButton from "@/components/buttons/imageUploadButton"

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
      <NextImage src="/LOGO2.png" alt="logo" width={300} height={300} />

      <div className="flex w-full max-w-md">
        <Input
          className="flex-1 mr-2"
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

        <Button color="primary" className="bg-red-900" onPress={handleSearch}>
          검색
        </Button>
      </div>

      {showAlert && (
        <div className="alert-container">
          <Alert color="warning" title="검색어 미입력" />
        </div>
      )}

      {/* 이미지 업로드 컴포넌트 */}
      <ImageUploadButton />
    </div>

  );
}
