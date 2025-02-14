"use client";

import { useState, useEffect } from "react";
import { Button, Checkbox, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { Card, CardBody } from "@heroui/card";
import { useRouter } from "next/router";

const filters = {
  wine: {
    price: ["~5", "6~15", "16~50", "50~200+"],
    alcohol: ["~10", "11~14", "15~22"],
    volume: ["375", "750", "1500", "3000"],
    type: ["레드", "화이트", "로제", "스파클링"],
  },
  whiskey: {
    price: ["~10", "10~30", "30~100", "100+"],
    alcohol: ["40~45", "46~50", "50+"],
    volume: ["~700", "700~1000", "1000+"],
    type: ["진", "데킬라", "보드카", "럼", "리큐어", "위스키", "브랜디"],
  },
};

export default function FilterSection({ title, category, items, defaultFilter }) {
  const [selectedFilters, setSelectedFilters] = useState(
    Object.keys(filters[category]).reduce((acc, key) => ({ ...acc, [key]: [] }), {})
  );
  const router = useRouter();

  useEffect(() => {
    if (defaultFilter) {
      setSelectedFilters((prev) => ({
        ...prev,
        type: filters[category].type.includes(defaultFilter) ? [defaultFilter] : [],
      }));
    }
  }, [defaultFilter, category]);

  const toggleFilter = (filterCategory, value) => {
    setSelectedFilters((prev) => {
      const updatedCategory = prev[filterCategory].includes(value)
        ? prev[filterCategory].filter((item) => item !== value)
        : [...prev[filterCategory], value];
      return { ...prev, [filterCategory]: updatedCategory };
    });
  };

  return (
    <>
      <div className="w-full max-w-full mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold text-[#6F0029] mb-1">{title}</h1>
        <div className="h-[3px] bg-[#6F0029] mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {Object.entries(filters[category]).map(([filterCategory, options]) => (
            <div key={filterCategory} className="bg-gray-100 p-2 rounded">
              <h3 className="text-md font-bold mb-2">{filterCategory}</h3>
              <div className="grid grid-cols-2 gap-1">
                {options.map((option) => (
                  <Checkbox
                    key={option}
                    checked={selectedFilters[filterCategory].includes(option)}
                    onChange={() => toggleFilter(filterCategory, option)}
                  >
                    {option}
                  </Checkbox>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <CardBody>
              <img src={item.image} alt={item.name} className="w-full h-32 object-cover mb-2" />
              <h3 className="text-center text-md font-bold">{item.name}</h3>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}
