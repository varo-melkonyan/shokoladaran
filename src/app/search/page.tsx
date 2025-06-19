import { Suspense } from "react";
import SearchComponent from "@/components/SearchComponent";

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchComponent />
    </Suspense>
  );
}