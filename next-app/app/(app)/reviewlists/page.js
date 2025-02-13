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
import Like from "@/components/like-buttons/like-buttons"

export default function ReviewHeader() {
  const { resolvedTheme } = useTheme();
  const [filter, setFilter] = useState("추천순");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement, setModalPlacement] = useState("auto");
  const [selectedRating, setSelectedRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

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
                  value={review.rating}
                  readOnly
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm mt-4 flex-1">{review.comment}</p>
                <Like className="ml-4" />
              </div>
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
                    value={selectedRating}
                    onChange={(value) => {
                      setSelectedRating(value)
                      console.log(value)
                    }}

                  />
                </div>
                <Textarea
                  isClearable
                  className="max-w-full"
                  placeholder="write review"
                  variant="bordered"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  onClear={() => {
                    setNewReviewText("")
                    console.log("textarea cleared")
                  }}
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
