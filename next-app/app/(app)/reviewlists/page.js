"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
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
import Like from "@/components/like-buttons/like-buttons";

export default function ReviewHeader() {
  const { resolvedTheme } = useTheme();
  const { data: session } = useSession();
  const [filter, setFilter] = useState("추천순");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement, setModalPlacement] = useState("auto");
  const [selectedRating, setSelectedRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const loggedInUser = { id: session.user.email };

  const handleDeleteReview = (id) => {
    setReviews((prev) => prev.filter((review) => review.id !== id));
  };

  const handleOpenModalForEdit = (review) => {
    setEditingReviewId(review.id);
    setNewReviewText(review.comment);
    setSelectedRating(review.rating);
    onOpen();
  };

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
            onPress={() => {
              setEditingReviewId(null);
              setNewReviewText("");
              setSelectedRating(0);
              onOpen();
            }}
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
                <StarRating totalStars={5} value={review.rating} readOnly />
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm flex-1">{review.comment}</p>
                <div className="ml-4">
                  <Like className="flex flex-row" />
                </div>
              </div>
              {loggedInUser && review.description === loggedInUser.id && (
                <div className="flex space-x-2 mt-2">
                  <Button
                    className="w-10 h-5"
                    color="primary"
                    onPress={() => handleOpenModalForEdit(review)}
                  >
                    수정
                  </Button>
                  <Button
                    className="w-10 h-5"
                    color="danger"
                    onPress={() => handleDeleteReview(review.id)}
                  >
                    삭제
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isOpen}
        placement={modalPlacement}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">
                {editingReviewId ? "리뷰 수정" : "리뷰 작성"}
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-end mb-4">
                  <StarRating
                    totalStars={5}
                    value={selectedRating}
                    onChange={(value) => {
                      setSelectedRating(value);
                    }}
                  />
                </div>
                <Textarea
                  isClearable
                  className="max-w-full"
                  placeholder="리뷰 내용을 입력하세요"
                  variant="bordered"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  onClear={() => {
                    setNewReviewText("");
                    console.log("textarea cleared");
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
                    if (editingReviewId) {
                      setReviews((prev) =>
                        prev.map((review) =>
                          review.id === editingReviewId
                            ? {
                              ...review,
                              comment: newReviewText,
                              rating: selectedRating,
                            }
                            : review
                        )
                      );
                    } else {
                      const newReview = {
                        id: Date.now(),
                        user: loggedInUser.nickname,
                        avatar:
                          "https://i.pravatar.cc/150?u=" + Date.now(),
                        description: loggedInUser.id,
                        comment: newReviewText,
                        rating: selectedRating,
                      };
                      setReviews((prev) => [newReview, ...prev]);
                    }
                    setNewReviewText("");
                    setSelectedRating(0);
                    setEditingReviewId(null);
                    onClose();
                  }}
                >
                  등록
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
