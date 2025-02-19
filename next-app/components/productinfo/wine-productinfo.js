"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/react";
import { Textarea } from "@heroui/react";
import { Progress } from "@heroui/react";

export default function wineDetail({ wine }) {
  return (
    <Card className="p-4">
      <div className="flex items-center space-x-7 mb-4">
        <div className="flex-shrink-0">
          <Image
            alt={wine.korName}
            className="object-cover rounded-xl"
            src={wine.image || "/LOGO4.png"}
            width={150}
            height={188}
          />
        </div>
        <div className="flex flex-col justify-center">
          <h6 className="font-bold text-xl mt-1">
            {wine.korName}
          </h6>
          <h7 className="text-tiny uppercase font-bold text-gray-500">
            {wine.engName}
          </h7>
        </div>
      </div>
      <CardBody>
        <Textarea
          isReadOnly
          className="max-w-full"
          value={wine.details}
          label="Description"
          labelPlacement="outside"
          variant="bordered"
        />
        <div className="space-y-3 mt-5">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold w-16">단맛</span>
            <Progress value={wine.sweetness * 20} />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold w-16">신맛</span>
            <Progress value={wine.acidity * 20} />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold w-16">목넘김</span>
            <Progress value={wine.body * 20} />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold w-16">떫은맛</span>
            <Progress value={wine.tanin * 20} />
            {/* <span className="text-xs w-8 text-left">%</span> */}
          </div>
        </div>

      </CardBody>
    </Card>
  );
}
