"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
} from "@heroui/react";
import { Card, CardBody } from "@heroui/card";
import { User } from "@heroui/react";
import StarRating from "@/components/starrating/starRating";

export default function ReviewHeader() {
  const { resolvedTheme } = useTheme();
  const [filter, setFilter] = useState("추천순");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement, setModalPlacement] = useState("auto");
  const [selectedRating, setSelectedRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");

  // ✅ 리뷰 데이터
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "동재재재",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      description: "와인 애호가",
      comment: "와인과 잘 어울리는 풍미가 최고였어요!",
      rating: 4,
    },
    {
      id: 2,
      user: "지창창",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      description: "술 마스터",
      comment: "진한 맛과 향이 정말 만족스러웠습니다.",
      rating: 4,
    },
    {
      id: 3,
      user: "승훈훈",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      description: "초보 와인러",
      comment: "무난한 맛이었어요. 가성비 괜찮네요!",
      rating: 4,
    },
  ]);

  return (
    <>
      <div className="w-full max-w-full mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold text-[#6F0029] mb-1">평가 & 리뷰</h1>
        <div className="h-[3px] bg-[#6F0029] mb-4" />

        <div className="flex justify-between items-center">
          <button
            className="inline-flex items-center space-x-1 text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50"
            onClick={() => setFilter(filter === "추천순" ? "최신순" : "추천순")}
          >
            <span>{filter}</span>
          </button>

          <Button
            onPress={onOpen}
            className="inline-flex items-center space-x-1 text-sm text-white bg-[#6F0029] px-3 py-1.5 rounded hover:bg-[#8F0033]"
          >
            리뷰 작성
          </Button>
        </div>
      </div>

      <div className="w-full max-w-full mx-auto p-1">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"
              } p-4 mb-4`}
          >
            <CardBody>
              <div className="flex justify-between items-center">
                <User
                  avatarProps={{ src: review.avatar }}
                  name={review.user}
                  description={review.description}
                />
                <StarRating
                  totalStars={5}
                  onChange={(value) => setSelectedRating(value)}
                  readOnly
                />
              </div>
              <p className="text-sm mt-4">{review.comment}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal isOpen={isOpen} placement={modalPlacement} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">리뷰 작성</ModalHeader>
              <ModalBody>
                <div className="flex justify-end">
                  <StarRating
                    totalStars={5}
                    onChange={(value) => setSelectedRating(value)}
                  />
                </div>
                <Textarea
                  isClearable
                  className="max-w-full"
                  defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  placeholder="Description"
                  variant="bordered"
                  onClear={() => console.log("textarea cleared")}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  취소
                </Button>
                <Button
                  color="bg-primary"
                  onPress={() => {
                    const newReview = {
                      id: Date.now(),
                      user: "익명",
                      avatar: "https://i.pravatar.cc/150?u=" + Date.now(),
                      description: "새 리뷰 작성자",
                      comment: newReviewText,
                      rating: selectedRating,
                    };
                    setReviews((prevReviews) => [newReview, ...prevReviews]);
                    setNewReviewText("");
                    setSelectedRating(0);
                    onClose();
                  }}
                >
                  등록
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal >
    </>
  );
}
