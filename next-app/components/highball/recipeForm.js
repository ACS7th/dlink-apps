"use client";

import { useState, useEffect } from "react";
import { Button, Textarea, Image } from "@heroui/react";
import { ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import IngredientInput from "@/components/highball/ingredients";
import { ScrollShadow } from "@heroui/react";

export default function RecipeForm({
  onClose,
  onSubmit,
  initialName = "",
  initialMaking = "",
  initialIngredientsJSON = "",
  initialImageUrl = "",
}) {
  const [name, setName] = useState(initialName);
  const [making, setMaking] = useState(initialMaking);
  const [ingredients, setIngredients] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(initialImageUrl);

  // 초기 재료 JSON을 배열로 변환
  useEffect(() => {
    if (initialIngredientsJSON) {
      try {
        const parsed = JSON.parse(initialIngredientsJSON);
        const arr = Object.entries(parsed).map(([key, value]) => ({ key, value }));
        setIngredients(arr);
      } catch (error) {
        console.error("재료 파싱 오류:", error);
      }
    } else {
      setIngredients([{ key: "", value: "" }]);
    }
  }, [initialIngredientsJSON]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("making", making);
    // 재료 배열 → 객체 → JSON, key 이름은 "ingredientsJSON"으로 통일
    const ingredientsObj = ingredients.reduce((acc, curr) => {
      if (curr.key.trim() && curr.value.trim()) {
        acc[curr.key] = curr.value;
      }
      return acc;
    }, {});
    formData.append("ingredientsJSON", JSON.stringify(ingredientsObj));
    // 이미지 파일: 새로 선택한 이미지가 있으면 전송, 없고 기존 이미지가 제거된 경우 빈 값 전송
    if (selectedImage) {
      formData.append("imageFile", selectedImage, selectedImage.name);
    } else if (!currentImageUrl) {
      // 만약 기존 이미지가 삭제되었으면 빈 값 전송 (백엔드에서 이를 인식하여 이미지를 삭제하도록)
      formData.append("imageFile", "");
    }
    onSubmit(formData, onClose);
  };

  return (
    <ScrollShadow
      hideScrollBar
      className="max-h-[500px]"
      offset={100}
      orientation="horizontal"
    >
      <ModalHeader>{initialName ? "레시피 수정" : "하이볼 레시피 작성"}</ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">제목</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="예: 하이볼"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* 만드는 법 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">만드는 법</label>
            <Textarea
              isClearable
              className="mt-1 block w-full"
              placeholder="하이볼 만드는 방법"
              variant="bordered"
              value={making}
              onChange={(e) => setMaking(e.target.value)}
              onClear={() => setMaking("")}
            />
          </div>
          {/* 재료 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">재료</label>
            <IngredientInput ingredients={ingredients} onChange={setIngredients} />
          </div>
          {/* 기존 이미지 미리보기 및 삭제 버튼 (수정 모드) */}
          {currentImageUrl && !selectedImage && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">기존 이미지 미리보기:</p>
              <Image src={currentImageUrl} alt="기존 이미지" />
              <Button
                onPress={() => setCurrentImageUrl("")}
                variant="light"
                color="danger"
                className="mt-1 text-xs"
              >
                이미지 삭제
              </Button>
            </div>
          )}
          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">이미지 파일 (선택)</label>
            <input
              type="file"
              className="mt-1 block w-full"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          취소
        </Button>
        <Button color="bg-primary" onPress={handleSubmit}>
          {initialName ? "수정" : "등록"}
        </Button>
      </ModalFooter>
    </ScrollShadow>
  );
}
