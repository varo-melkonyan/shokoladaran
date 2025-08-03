import { Suspense } from "react";
import SearchComponent from "@/components/SearchComponent";
import { t } from "i18next";

export default function SearchPage() {
  return (
    <Suspense fallback={<div>{t("loading")}</div>}>
      <SearchComponent />
    </Suspense>
  );
}