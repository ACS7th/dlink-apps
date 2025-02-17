import { useState, useEffect } from "react";

export default function IngredientInput({ ingredients = [], onChange }) {
  // 초기 ingredients가 없으면 빈 항목 하나 생성
  const [items, setItems] = useState(
    ingredients.length > 0 ? ingredients : [{ key: "", value: "" }]
  );

  // items 상태가 변경되면 부모에 전달
  useEffect(() => {
    if (onChange) {
      onChange(items);
    }
  }, [items, onChange]);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { key: "", value: "" }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    // max-h-[300px]로 최대 높이를 지정하고 overflow-y-auto로 내부 스크롤 활성화
    <div className="max-h-[300px] overflow-y-auto">
      {items.map((item, i) => (
        <div key={i} className="flex space-x-1 mt-1">
          <input
            type="text"
            placeholder="Key"
            value={item.key}
            onChange={(e) => handleChange(i, "key", e.target.value)}
            className="border p-1 rounded text-sm w-1/3"
          />
          <input
            type="text"
            placeholder="Value"
            value={item.value}
            onChange={(e) => handleChange(i, "value", e.target.value)}
            className="border p-1 rounded text-sm w-2/3"
          />
          <button
            onClick={() => removeItem(i)}
            className="bg-red-200 px-2 py-1 rounded text-sm"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="mt-2 bg-blue-200 px-2 py-1 rounded text-sm"
      >
        Add Ingredient
      </button>
    </div>
  );
}
