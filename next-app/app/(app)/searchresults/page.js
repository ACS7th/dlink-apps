"use client";

import Content from "@/components/home/content";
import { ScrollShadow } from "@heroui/react";
import { Tabs, Tab } from "@heroui/tabs";
import WineSearchResultsPage from "@/components/searchresults/wineSearchResults";
import YangjuSearchResults from "@/components/searchresults/yangjuSearchResults";

export default function Search() {
  const tabs = [
    { id: "Wine", label: "와인" },
    { id: "Yangju", label: "양주" },
  ];

  return (
    <ScrollShadow className="w-full h-[90vh]">
      <div className="flex w-full flex-col p-1 rounded-md shadow-md h-full">
        <Tabs aria-label="Dynamic tabs" items={tabs} fullWidth>
          {tabs.map((tab) => (
            <Tab key={tab.id} title={tab.label}>
              {tab.id === "Wine" ? <WineSearchResultsPage/> : <YangjuSearchResults />}
            </Tab>
          ))}
        </Tabs>
      </div>
    </ScrollShadow>
  );
}
