"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import axios from "axios";

const PairingCard = () => {
    const { resolvedTheme } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState("Meat");
    const [recommendation, setRecommendation] = useState({
        image: "",
        description: "",
    });

    const categories = ["Meat", "Sea Food", "Fried", "Snack"];

    const fetchRecommendation = async (category) => {
        try {
            const response = await axios.get(`/api/recommendations?category=${category}`);
            setRecommendation(response.data);
        } catch (error) {
            console.error("Failed to fetch recommendation:", error);
        }
    };

    useEffect(() => {
        fetchRecommendation(selectedCategory);
    }, [selectedCategory]);

    return (
        <Card className={`${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"} p-1`}>
            <CardBody>
                <div className="flex justify-evenly space-x-2 mb-4">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            size="sm"
                            radius="sm"
                            className={`${selectedCategory === category
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-black"
                                } transition duration-300`}
                            onPress={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-300 rounded-md animate-pulse" />
                    <p className="text-sm">{recommendation.description || "내용을 불러오는 중입니다."}</p>
                </div>
            </CardBody>
        </Card>
    );
};

export default PairingCard;
