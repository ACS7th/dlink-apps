import { useState } from "react";
import { Button, Textarea } from "@heroui/react";
import { ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import IngredientInput from "@/components/highball/ingredients";

export default function RecipeForm({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [making, setMaking] = useState("");
  // ingredients는 key/value 객체 배열로 관리
  const [ingredients, setIngredients] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("making", making);

    // ingredients 배열을 { key: value, ... } 객체로 변환
    const ingredientsObj = ingredients.reduce((acc, curr) => {
      // key와 value가 모두 비어있지 않은 경우에만 추가
      if (curr.key.trim() && curr.value.trim()) {
        acc[curr.key] = curr.value;
      }
      return acc;
    }, {});
    // 변환된 객체를 JSON 문자열로 만들어 "ingredients" 키로 전송
    formData.append("ingredients", JSON.stringify(ingredientsObj));
    if (selectedImage) {
      formData.append("imageFile", selectedImage, selectedImage.name);
    }
    onSubmit(formData, onClose);
  };

  return (
    <>
      <ModalHeader>하이볼 레시피 작성</ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="예: 하이볼"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">making</label>
            <Textarea
              isClearable
              className="mt-1 block w-full"
              placeholder="하이볼 만드는 방법"
              variant="bordered"
              value={making}
              onChange={(e) => setMaking(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ingredients</label>
            <IngredientInput
              ingredients={ingredients}
              onChange={setIngredients}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image File (선택)</label>
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
          등록
        </Button>
      </ModalFooter>
    </>
  );
}
