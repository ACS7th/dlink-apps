"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Alert } from "@heroui/alert";
import { CameraIcon } from "@/components/icons/cameraicon";
import axios from "axios";

export default function ImageUploadButton() {
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // 📌 파일 선택 트리거 함수
  const triggerFileInput = () => {
    document.getElementById("file-upload")?.click();
  };

  // 📌 파일 선택 시 실행되는 함수 (async 추가)
  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      // 파일 형식 검증
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("허용되지 않는 파일 형식입니다. JPG 또는 PNG 이미지를 선택하세요.");

        // ✅ 1초 후 에러 메시지 숨기기
        setTimeout(() => setErrorMessage(""), 1000);

        return;
      }

      // 파일 크기 검증
      if (file.size > maxSize) {
        setErrorMessage("파일 크기가 5MB를 초과했습니다. 5MB 이하의 파일을 선택하세요.");

        // ✅ 1초 후 에러 메시지 숨기기
        setTimeout(() => setErrorMessage(""), 1000);

        return;
      }

      // 오류 메시지 초기화 및 업로드 완료 알림
      setErrorMessage("");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 1000); // 1초 후 알림 숨김


      // 콘솔에 업로드된 파일 정보 출력
      console.log("업로드된 파일:", file.name, `${(file.size / 1024).toFixed(2)} KB`);

      // 📌 FormData 생성 후 업로드
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post("/api/v1/texttract", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("📌 추출된 텍스트:", response.data.text);
      } catch (error) {
        console.error("❌ 업로드 오류:", error);
        setErrorMessage("파일 업로드에 실패했습니다.");
      }
    }
  };

  return (
    <div className="flex flex-col mr-2">
      {/* 이미지 업로드 버튼 */}
      <Button
        isIconOnly
        color="primary"
        className="bg-red-900"
        onPress={triggerFileInput}
      >
        <CameraIcon />
      </Button>

      {/* 숨겨진 파일 입력 */}
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
