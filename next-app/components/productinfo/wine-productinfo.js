"use client";

import { Image } from "@heroui/react";
import { Progress } from "@heroui/react";
import { Card, CardHeader, CardBody } from "@heroui/react";

export default function ProductInfo() {
  const tasteProfile = [
    { label: "단맛", value: 80 },
    { label: "신맛", value: 30 },
    { label: "목넘김", value: 50 },
    { label: "떫은맛", value: 60 },
  ];

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center space-x-7 mb-4">
          <div className="flex-shrink-0">
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src="https://heroui.com/images/hero-card-complete.jpeg"
              width={150}
              height={150}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h5 className="font-bold text-xl mt-1">Frontend Radio</h5>
            <p className="text-tiny uppercase font-bold text-gray-500">Daily Mix</p>
            <small className="text-default-500">12 Tracks</small>
          </div>
        </div>
        <CardBody className="p-1">
          <div className="space-y-3">
            {tasteProfile.map((taste, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="text-sm font-semibold w-16 text-right">{taste.label}</span>
                
                <Progress value={taste.value} />

                <span className="text-xs w-8 text-left">{taste.value}%</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </>
  );
}
