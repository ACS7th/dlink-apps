import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import React from "react";

const HighballItemCard = () => {


    return (
        <div className="gap-2 grid grid-cols-3 ">
            <Card
                key={1}
                isPressable
                shadow="sm"
                onPress={() => console.log("item pressed")}
            >
                <CardBody className="overflow-visible p-0">
                    <Image
                        // alt={item.title}
                        className="w-full object-cover h-[140px]"
                        radius="lg"
                        shadow="sm"
                        // src={item.img}
                        width="100%"
                    />
                </CardBody>
                <CardFooter className="text-small justify-between">
                    <b>{123}</b>
                    <p className="text-default-500">몰러</p>
                </CardFooter>
            </Card>
            <Card
                key={1}
                isPressable
                shadow="sm"
                onPress={() => console.log("item pressed")}
            >
                <CardBody className="overflow-visible p-0">
                    <Image
                        // alt={item.title}
                        className="w-full object-cover h-[140px]"
                        radius="lg"
                        shadow="sm"
                        // src={item.img}
                        width="100%"
                    />
                </CardBody>
                <CardFooter className="text-small justify-between">
                    <b>{123}</b>
                    <p className="text-default-500">몰러</p>
                </CardFooter>
            </Card>
            <Card
                key={1}
                isPressable
                shadow="sm"
                onPress={() => console.log("item pressed")}
            >
                <CardBody className="overflow-visible p-0">
                    <Image
                        // alt={item.title}
                        className="w-full object-cover h-[140px]"
                        radius="lg"
                        shadow="sm"
                        // src={item.img}
                        width="100%"
                    />
                </CardBody>
                <CardFooter className="text-small justify-between">
                    <b>{123}</b>
                    <p className="text-default-500">몰러</p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default HighballItemCard;
