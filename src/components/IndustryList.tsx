"use client";

import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useIndustryStore } from "@/store/industryStore";

type TIndustry = {
  id: string;
  industry_name: string;
  industry_count: number;
};

export default function IndustryList() {
  const [industry, setIndustry] = useState<TIndustry[]>([]);
  const selectedIndustry = useIndustryStore((state) => state.selectedIndustry);
  const setSelectedIndustry = useIndustryStore(
    (state) => state.setSelectedIndustry
  );

  async function getIndustry() {
    try {
      const res = await getDocs(collection(db, "industry"));
      setIndustry(
        res.docs.map((doc) => ({
          id: doc.id,
          industry_name: doc.data().industry_name,
          industry_count: doc.data().industry_count,
        }))
      );
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getIndustry();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const selectedIndustryName = industry.find(
    (item) => item.id === selectedIndustry
  )?.industry_name;

  return (
    <div className="p-2 sm:p-4" dir="rtl">
      <h1 className="font-bold text-2xl sm:text-3xl mb-4 sm:mb-6">
        استكشف الشركات الناشئة
      </h1>

      {/* Mobile Dropdown */}
      <div className="sm:hidden relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 border border-gray-200 rounded-xl flex items-center justify-between"
        >
          <span className="font-medium">
            {selectedIndustryName || "اختر الصناعة"}
          </span>
          <div className="flex items-center gap-2">
            {selectedIndustry && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                viewBox="0 0 20 20"
                fill="currentColor"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndustry(null);
                }}
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
            {industry.map((item) => (
              <div
                key={item.id}
                className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between ${
                  selectedIndustry === item.id ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  setSelectedIndustry(
                    selectedIndustry === item.id ? null : item.id
                  );
                  setIsOpen(false);
                }}
              >
                <span className="font-medium">{item.industry_name}</span>
                <span className="text-gray-500 text-sm">
                  ({item.industry_count})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop List */}
      <div className="hidden sm:flex flex-wrap gap-6">
        {industry.map((item) => (
          <div
            key={item.id}
            className={`border border-gray-200 rounded-xl p-4 hover:cursor-pointer hover:shadow-md transition-shadow duration-200 flex items-center gap-2 ${
              selectedIndustry === item.id ? "bg-blue-50 border-blue-200" : ""
            }`}
            onClick={() =>
              setSelectedIndustry(selectedIndustry === item.id ? null : item.id)
            }
          >
            <span className="font-medium text-lg">{item.industry_name}</span>
            <span className="text-gray-500 text-sm">
              ({item.industry_count})
            </span>
            {selectedIndustry === item.id && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 hover:text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
