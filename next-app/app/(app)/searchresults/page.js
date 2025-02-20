"use client";

import { useEffect, useState } from "react";
import { ScrollShadow } from "@heroui/react";
import { Tabs, Tab } from "@heroui/tabs";
import WineSearchResultsPage from "@/components/searchresults/wineSearchResults";
import YangjuSearchResults from "@/components/searchresults/yangjuSearchResults";
import React, { Suspense } from 'react';

export default function Search() {
  const [tabKey, setTabKey] = useState("Wine");

  const tabs = [
    { id: "Wine", label: "와인" },
    { id: "Yangju", label: "양주" },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScrollShadow className="w-full h-[90vh]">
        <div className="flex w-full flex-col p-1 rounded-md shadow-md h-full">
          <Tabs aria-label="Dynamic tabs" selectedKey={tabKey} onSelectionChange={setTabKey} fullWidth>
            {tabs.map((tab) => (
              <Tab key={tab.id} title={tab.label}>
                {tab.id === "Wine" ? (
                  <WineSearchResultsPage setTabKey={setTabKey} />
                ) : (
                  <YangjuSearchResults setTabKey={setTabKey} />
                )}
              </Tab>
            ))}
          </Tabs>
        </div>
      </ScrollShadow>
    </Suspense>
  );
}
