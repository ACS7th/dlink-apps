import { Card, CardBody } from "@heroui/card";
import { User, Textarea, Image } from "@heroui/react";
import Like from "@/components/buttons/likeButtons";
import CardMenu from "@/components/highball/cardmenu";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import LoginUser from "../auth/loginUser";

export default function RecipeCard({ item, session, resolvedTheme, onDelete, onEdit, onLikeToggle, readOnly = false }) {
  const isOwner = item.writeUser === session?.user?.id;

  return (
    <Card className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"} p-1 mb-4 relative`}>
      <CardBody>
        {/* 상단 우측 메뉴 (작성자일 경우) */}
        {isOwner && (
          <div className="absolute top-2 right-1">
            <CardMenu
              onEdit={() => { if (onEdit) onEdit(item); }}
              onDelete={() => { if (onDelete) onDelete(item.id, item.writeUser); }}
            />
          </div>
        )}
        {/* 사용자 프로필 정보 */}
        <div className="flex items-center">
          <LoginUser userId={item.writeUser} />
        </div>
        <div className="mt-1 mb-2">
          <h2 className="font-semibold text-lg">🍹 {item.name ? item.name : "레시피"}</h2>
          <div className="flex justify-between items-center mt-2">
            <Image src={item.imageUrl ? item.imageUrl : "/LOGO.png"} alt="Recipe Image" />
          </div>
          <div className="mb-1 mt-2 font-bold">제조법</div>
          <Textarea isReadOnly className="max-w-full" defaultValue={item.making} variant="bordered" />
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
        {/* 하단: 등록 시간과 좋아요 버튼 */}
        <div className="flex flex-row items-center mt-2">
          <div className="flex flex-row items-center">
            {item.createdAt && (
              <span className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            )}
          </div>
          <Like
            itemId={item.id}
            userEmail={session?.user?.id}
            initialLikes={item.likeCount}
            initialLiked={item.likedUsers && item.likedUsers.includes(session?.user?.id)}
            className="flex flex-row items-end ml-auto"
            readOnly={readOnly}
            onLikeToggle={onLikeToggle}
          />
        </div>
      </CardBody>
    </Card>
  );
}
