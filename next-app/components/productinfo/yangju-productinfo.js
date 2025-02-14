"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Image, Textarea } from "@heroui/react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/v1/details?id=${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("상품정보 호출 오류:", err);
        setError("상품 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading)
    return <div className="py-10 text-center">Loading...</div>;
  if (error)
    return <div className="py-10 text-center text-red-500">{error}</div>;
  if (!product)
    return <div className="py-10 text-center">상품 정보가 없습니다.</div>;

  return (
    <Card className="p-4 max-w-lg mx-auto shadow-lg">
      <div className="flex flex-row space-x-7 mb-4">
        <div className="flex-shrink-0">
          <Image
            alt={product.korName || "상품 이미지"}
            className="object-cover rounded-xl"
            src={product.image}
            width={150}
            height={188}
          />
        </div>
        <div className="flex flex-col ">
          <h6 className="font-bold text-xl">
            {product.korName}
          </h6>
          <p className="text-tiny uppercase font-bold text-gray-500">
            {product.engName}
          </p>
          <p className="text-sm mt-2">
            <p>원산지: {product.origin}</p>
            <p>도수: {product.percent}%</p>
            <p>용량: {product.volume}ml</p>
            <p>가격: {product.price.toLocaleString()}원</p>
          </p>
        </div>
      </div>
      <CardBody>
        <Textarea
          isReadOnly
          className="max-w-full"
          defaultValue={product.explanation}
          // label="Description"
          // labelPlacement="outside"
          variant="bordered"
        />
      </CardBody>
    </Card>
  );
}
