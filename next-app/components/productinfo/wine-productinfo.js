"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/react";
import { Textarea } from "@heroui/react";
import { Progress } from "@heroui/react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("Product ID:", id);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>상품 정보가 없습니다.</div>;

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-7 mb-4">
        <div className="flex-shrink-0">
          <Image
            alt={product.korName || "상품 이미지"}
            className="object-cover rounded-xl"
            src={product.image}
            width={150}
            height={188}
          />
        </div>
        <div className="flex flex-col justify-center">
          <h6 className="font-bold text-xl mt-1">
            {product.korName}
          </h6>
          <h7 className="text-tiny uppercase font-bold text-gray-500">
            {product.engName}
          </h7>
          <ul className="list-inside">
            <li>{product.origin}</li>
            <li>{product.percent}%</li>
            <li>{product.volume}ml</li>
            <li>{product.price.toLocaleString()}원</li>
          </ul>
        </div>
      </div>
      <CardBody>
        <Textarea
          isReadOnly
          className="max-w-xs"
          defaultValue={product.explanation}
          label="Description"
          labelPlacement="outside"
          variant="bordered"
        />
        <div className="space-y-3">
          {product.map((taste, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="text-sm font-semibold w-16 text-right">{taste.label}</span>

              <Progress value={taste.value} />

              <span className="text-xs w-8 text-left">{taste.value}%</span>
            </div>
          ))}
        </div>

      </CardBody>
    </Card>
  );
}
