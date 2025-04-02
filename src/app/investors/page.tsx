"use client";
import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface InvestorData {
  id: string;
  investor_logo?: string;
  investor_name: string;
  investor_description: string;
  investor_startups?: Array<{ id: string; name: string }>;
}

export default function InvestorsPage() {
  const [investorData, setInvestorData] = React.useState<InvestorData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  async function fetchInvestorData() {
    setIsLoading(true);
    try {
      const res = await getDocs(collection(db, `investors`));
      if (res.empty) {
        setInvestorData([]);
      } else {
        const data = res.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setInvestorData(data);
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    fetchInvestorData();
  }, []);

  return (
    <div dir="rtl" className="p-4 max-w-7xl mx-auto mt-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">أبرز المستثمرين</h1>
        <p className="text-xl text-gray-600">
          اكتشف أنشط شركات رأس المال الاستثماري والمستثمرين الملائكة الذين
          يدعمون الشركات الناشئة في مراحلها المبكرة
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {investorData.map((investor) => (
            <div
              key={investor.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <Link href={`/investors/${investor.id}`}>
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-4 relative">
                    {investor.investor_logo ? (
                      <Image
                        src={investor.investor_logo}
                        alt={investor.investor_name}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-xl font-bold">
                          {investor.investor_name?.charAt(0) || "?"}
                        </span>
                      </div>
                    )}
                  </div>
                  <h2 className="font-bold text-xl mb-2">
                    {investor.investor_name}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {investor.investor_description}
                  </p>
                  {investor.investor_startups && (
                    <p className="mt-2 text-sm text-gray-500">
                      {investor.investor_startups.length} استثمار
                    </p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
