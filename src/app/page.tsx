import IndustryList from "@/components/IndustryList";
import StartupCards from "@/components/StartupCards";
import React from "react";

export default function page() {
  return (
    <div className="p-12">
      <IndustryList />
      <StartupCards />
    </div>
  );
}
