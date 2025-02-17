import { useState } from "react";
import { Button, Textarea } from "@heroui/react";
import { ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";

export default function RecipeForm({ onClose, onSubmit }) {
  const [Name, setEngName] = useState("");
  const [making, setMaking] = useState("");
  const [ingredientsJSON, setIngredientsJSON] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("Name", Name);
    formData.append("making", making);
    formData.append("ingredientsJSON", ingredientsJSON);
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
            <label className="block text-sm font-medium text-gray-700">korName</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="예: 하이볼"
              value={Name}
              onChange={(e) => setKorName(e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700">ingredientsJSON</label>
            <Textarea
              isClearable
              className="mt-1 block w-full"
              placeholder='예: {"진": "50ml", "토닉워터": "100ml"}'
              variant="bordered"
              value={ingredientsJSON}
              onChange={(e) => setIngredientsJSON(e.target.value)}
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
