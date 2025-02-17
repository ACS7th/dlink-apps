import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";

export default function CardMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  // 클릭 외부 감지하여 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button onPress={toggleMenu} className="p-1 bg-transparent">
        {/* 점 3개 아이콘 */}
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 10a2 2 0 114 0 2 2 0 01-4 0zm5 0a2 2 0 114 0 2 2 0 01-4 0zm-10 0a2 2 0 114 0 2 2 0 01-4 0z" />
        </svg>
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-24 border rounded shadow-lg z-50">
          <Button
            onPress={() => {
              onEdit();
              setOpen(false);
            }}
            className="block w-full text-left px-2 py-1 bg-transparent hover:bg-gray-100 text-sm"
          >
            수정
          </Button>
          <Button
            onPress={() => {
              onDelete();
              setOpen(false);
            }}
            className="block w-full text-left px-2 py-1 bg-transparent hover:bg-gray-100 text-sm"
          >
            삭제
          </Button>
        </div>
      )}
    </div>
  );
}
