"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";
import NextImage from "next/image";
import { Alert } from "@heroui/alert";
import ImageUploadButton from "@/components/buttons/imageUploadButton";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import FunnelIcon from "@/components/icons/funnelicon";

export default function Content() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();

  // 📌 검색 버튼 클릭 (경고 알람 및 페이지 이동)
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } else {
      router.push(`/searchresults?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
      
      <NextImage className="mb-6" src={resolvedTheme === 'dark' ? '/LOGO3.png' : '/LOGO2.png'} alt="logo" width={300} height={300} />
      <div className="flex space-x-2 w-full items-center mb-28 md:w-1/2 px-4">
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

        <Button
          color="primary"
          className="bg-primary"
          isIconOnly
          onPress={handleSearch}
        >
          <NextImage src="/search2.svg" alt="search" width={24} height={24} />
        </Button>

        <ImageUploadButton />
      </div>

      {showAlert && (
        <div className="alert-container mt-3">
          <Alert color="warning" title="검색어 미입력" />
        </div>
      )}
    </div>
  );
}
