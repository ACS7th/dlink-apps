"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Alert } from "@heroui/alert";
import { CameraIcon } from "@/components/icons/cameraicon";
import axios from "axios";

export default function ImageUploadButton() {
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const triggerFileInput = () => {
    document.getElementById("file-upload")?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("허용되지 않는 파일 형식입니다.");
        setTimeout(() => setErrorMessage(""), 1000);
        return;
      }

      if (file.size > maxSize) {
        setErrorMessage("파일 크기가 5MB를 초과했습니다.");
        setTimeout(() => setErrorMessage(""), 1000);
        return;
      }

      setErrorMessage("");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 1000);

      const formData = new FormData();
      formData.append("file", file);

      try {
        // 1️⃣ 텍스트 추출 API 호출
        const textResponse = await axios.post("/api/v1/texttract", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("📌 추출된 텍스트:", textResponse.data.text);

        // 2️⃣ Elasticsearch 검색 API 호출
        const searchResponse = await axios.post("/api/v1/imagesearch", {
          text: textResponse.data.text,
        });

        console.log("📌 검색 결과:", searchResponse.data.results);
        setSearchResults(searchResponse.data.results);
      } catch (error) {
        console.error("❌ 업로드 오류:", error);
        setErrorMessage("파일 업로드 또는 검색 실패");
      }
    }
  };

  return (
    <div className="flex flex-col mr-2">
      <Button isIconOnly color="primary" className="bg-red-900" onPress={triggerFileInput}>
        <CameraIcon />
      </Button>

      <input
        id="file-upload"
        type="file"
        accept="image/jpeg, image/png"
        className="hidden"
        onChange={handleImageChange}
      />

      {/* 파일 검증 오류 메시지 */}
      {errorMessage && (
        <div className="alert-container mt-2">
          <Alert color="danger" title={errorMessage} />
        </div>
      )}

      {/* 파일 업로드 성공 알림 */}
      {showAlert && (
        <div className="alert-container mt-2">
          <Alert color="success" title="파일 업로드 완료" />
        </div>
      )}

    </div>
  );
}
