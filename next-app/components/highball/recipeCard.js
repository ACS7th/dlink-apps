"use client";

import { Card, CardBody } from "@heroui/card";
import { Image, Textarea } from "@heroui/react";
import CardMenu from "@/components/highball/cardmenu";
import LoginUser from "../auth/loginUser";
import LikeButton from "../buttons/likeButton";

export default function RecipeCard({ item, session, resolvedTheme, onDelete, onEdit, onLikeToggle, readOnly = false }) {
  return (
    <Card className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"} p-1 mb-4 relative`}>
      <CardBody>
        {item.writeUser === session?.user?.id && (
          <div className="absolute top-2 right-1">
            <CardMenu
              onEdit={() => onEdit && onEdit(item)}
              onDelete={() => onDelete && onDelete(item.id, item.writeUser)}
            />
          </div>
        )}
        <div className="flex items-center">
          <LoginUser userId={item.writeUser} />
        </div>
        <div className="mt-1 mb-2">
          <h2 className="font-semibold text-lg">🍹 {item.name || "레시피"}</h2>
          <div className="flex justify-between items-center mt-2">
            <Image src={item.imageUrl ? item.imageUrl : "/LOGO.png"} alt="Recipe Image" />
          </div>
          <div className="mb-1 mt-2 font-bold">제조법</div>
          <Textarea
            isReadOnly
            className="max-w-full"
            value={item.making}  // 실시간 업데이트 위해 value 사용
            variant="bordered"
          />
          <div className="text-base mt-2">
            <p className="font-bold">재료</p>
            <ul className="list-disc ml-4">
              {item.ingredients &&
                Object.entries(item.ingredients).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-row items-center mt-2 justify-between">
          {item.createdAt ? (
            <span className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleString()}
            </span>
          ) : <span className="text-xs text-gray-500">2025. 2. 5. 오후 2:13:15</span>}
          <LikeButton
            itemId={item.id}
            userid={session?.user?.id}
            initialLikes={item.likeCount}
            initialLiked={item.likedUsers && item.likedUsers.includes(session?.user?.id)}
            className="flex flex-row items-center"
            readOnly={readOnly}
            onLikeToggle={onLikeToggle}
          />
        </div>
      </CardBody>
    </Card>
  );
}
