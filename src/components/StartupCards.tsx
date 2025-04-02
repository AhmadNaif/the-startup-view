"use client";

import { db } from "@/services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { StartupCard as StartupCardType } from "@/types/StartupCard";
import { useIndustryStore } from "@/store/industryStore";
import { handleError, formatErrorMessage } from "@/utils/error-handler";

export default function StartupCards() {
  const [startupCards, setStartupCards] = useState<StartupCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedIndustry = useIndustryStore((state) => state.selectedIndustry);

  const fetchStartupCards = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const startupsQuery = query(
        collection(db, "startups"),
        ...(selectedIndustry
          ? [where("startup_industry_id", "==", selectedIndustry)]
          : [])
      );

      const res = await getDocs(startupsQuery);
      const data = res.docs.map((doc) => ({
        startup_id: doc.id,
        ...doc.data(),
      })) as StartupCardType[];
      setStartupCards(data);
    } catch (err) {
      const appError = handleError(err);
      console.error("Error fetching startups:", appError);
      setError(formatErrorMessage(appError));
    } finally {
      setIsLoading(false);
    }
  }, [selectedIndustry]);

  useEffect(() => {
    fetchStartupCards();
  }, [fetchStartupCards]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            onClick={() => fetchStartupCards()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (startupCards.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">حدث خطاء</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
      dir="rtl"
    >
      {startupCards.map((startup) => (
        <div
          key={startup.startup_id}
          className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <Link href={`/${startup.startup_id}`}>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-4 relative">
                {startup.startup_logo ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={startup.startup_logo}
                      alt={startup.startup_name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-xl font-bold">
                      {startup.startup_name?.charAt(0) || "؟"}
                    </span>
                  </div>
                )}
              </div>
              <h2 className="font-bold text-xl mb-2">{startup.startup_name}</h2>
              <p className="text-gray-600 text-sm line-clamp-2">
                {startup.startup_description}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
