"use client";

import { Image } from "@heroui/react";
import { Progress } from "@heroui/react";
import { Card, Skeleton } from "@heroui/react";

export default function ProductInfo() {
  return (
    <>
      <div className="flex items-center space-x-4 border p-4 shadow-md">
        <Image
          isZoomed
          alt="HeroUI Fruit Image with Zoom"
          src="https://heroui.com/images/fruit-1.jpeg"
          width={150}
          height={150}
        />
        <div>
          <h2 className="text-xl font-bold">와인 이름</h2>
          <p>도수: 12%</p>
          <p>국가: 프랑스</p>
          <p>타입: 레드 와인</p>
        </div>
      </div>
      <div>
        <Progress
          className="max-w"
          color="warning"
          formatOptions={{ style: "currency", currency: "ARS" }}
          label="도수"
          maxValue={10000}
          showValueLabel={true}
          size="%"
          value={0}
        />
      </div>
    </>
  );
}
