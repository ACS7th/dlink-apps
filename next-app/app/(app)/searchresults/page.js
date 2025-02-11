"use client";

import Content from "@/components/home/content";
import SearchResults from "@/components/searchresults/searchResults";
import { ScrollShadow } from "@heroui/react";

export default function Search() {

  return (
    <ScrollShadow className="w-full h-[90vh]">
      <SearchResults />
    </ScrollShadow>
  )
}
