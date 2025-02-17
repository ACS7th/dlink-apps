import { Card, CardBody } from "@heroui/card";
import { User, Button, Textarea, Image } from "@heroui/react";
import Like from "@/components/buttons/likeButtons";

export default function RecipeCard({ item, session, resolvedTheme, onDelete, readOnly = false }) {
  return (
    <Card className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"} p-4 mb-4`}>
      <CardBody>
        {/* 등록한 사용자 프로필 정보 */}
        <div className="flex items-center">
          <User
            avatarProps={{
              src: item.writeUser === session?.user?.id
                ? session?.user?.profileImageUri || "/favicon.ico"
                : "/favicon.ico",
            }}
            name={
              item.writeUser === session?.user?.id
                ? session.user.name || "익명"
                : "익명"
            }
            description={
              item.writeUser === session?.user?.id
                ? session.user.email || "익명"
                : "일반회원"
            }
          />
        </div>
        <div className="mb-2">
          <h2 className="font-semibold text-lg">
            🍹 {item.Name}
          </h2>
          <div className="flex justify-between items-center mt-2">
            <Image
              src={item.imageUri ? item.imageUri : "/LOGO.png"}
              alt="Recipe Image"
            />
          </div>
          {/* <p className="mb-1">Category: {item.category}</p> */}
          <div
            className="mb-1 mt-2"
          > [Making]
          </div>
          <Textarea
            isReadOnly
            className="max-w-full"
            defaultValue={item.making}
            variant="bordered"
          />
          <div
            className="text-base mt-2"
          > [Ingredients] {item.ingredientsJSON}
          </div>
        </div>

        {/* 하단: 삭제 버튼과 좋아요 버튼 */}
        <div className="flex justify-between items-center mt-2">
          <div>
            {item.writeUser === session?.user?.id && (
              <Button
                color="danger"
                variant="light"
                onPress={() => onDelete(item.id, item.writeUser)}
                className="w-10 h-5"
              >
                삭제
              </Button>
            )}
          </div>
          <div>
            <Like
              itemId={item.id}
              userEmail={session.user.email}
              className="flex flex-row"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
