"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Image, Textarea } from "@heroui/react";
import YangjuTabs from "@/components/tabs/yangjuTabs";

export default function ProductDetail({product}) {

  return (
    <>
      <div>
        <Card className="p-4 shadow-lg">
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
            <div className="flex flex-col justify-center">
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
                <p>가격: {product?.price?.toLocaleString()}원</p>
                <p>카테고리: {product.category}</p>
              </p>
            </div>
          </div>
          <CardBody>
            <Textarea
              isReadOnly
              className="max-w-full"
              defaultValue={product.explanation}
              label="Description"
              labelPlacement="outside"
              variant="bordered"
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
