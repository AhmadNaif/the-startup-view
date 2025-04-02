"use client";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  handleError,
  formatErrorMessage,
  NotFoundError,
} from "@/utils/error-handler";

type InvestorDetails = {
  investor_logo: string;
  investor_name: string;
  investor_description: string;
  investor_website: string;
  investor_startups: {
    id: string;
    name: string;
    startup_logo?: string;
  }[];
  id: string;
};

export default function InvestorDetailsPage() {
  const params = useParams();
  const investorId = params.investorId as string;
  const [investor, setInvestor] = React.useState<InvestorDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function fetchInvestorDetails() {
      if (!investorId) return;

      setLoading(true);
      try {
        const investorDoc = await getDoc(doc(db, `investors/${investorId}`));

        if (!investorDoc.exists()) {
          throw new NotFoundError("Investor");
        }

        const data = investorDoc.data();
        const startups = data.investor_startups || [];

        // Fetch startup details in parallel
        const startupsWithLogos = await Promise.all(
          startups.map(async (startup: { id: string; name: string }) => {
            try {
              const startupDoc = await getDoc(
                doc(db, `startups/${startup.id}`)
              );
              if (startupDoc.exists()) {
                const startupData = startupDoc.data();
                return {
                  ...startup,
                  startup_logo: startupData.startup_logo,
                };
              }
              return startup;
            } catch (err) {
              const appError = handleError(err);
              console.error(`Error fetching startup ${startup.id}:`, appError);
              return startup;
            }
          })
        );

        setInvestor({
          investor_logo: data.investor_logo,
          investor_name: data.investor_name,
          investor_description: data.investor_description,
          investor_website: data.investor_website,
          investor_startups: startupsWithLogos,
          id: investorDoc.id,
        } as InvestorDetails);
      } catch (err) {
        const appError = handleError(err);
        console.error("Error fetching investor details:", appError);
        setError(formatErrorMessage(appError));
      } finally {
        setLoading(false);
      }
    }

    fetchInvestorDetails();
  }, [investorId]);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="text-2xl">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex flex-col justify-center items-center min-h-screen">
        <div className="text-2xl text-red-500">{error}</div>
        <Link
          href="/investors"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          العودة لصفحة المستثمرين
        </Link>
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="p-4 flex flex-col justify-center items-center min-h-screen">
        <div className="text-2xl">لم يتم العثور على المستثمر</div>
        <Link
          href="/investors"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          العودة لصفحة المستثمرين
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 text-right">
        <Link href="/investors" className="text-blue-500 hover:underline">
          العودة لصفحة المستثمرين &rarr;
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          {/* Logo and Name at the top */}
          <div className="flex flex-col sm:flex-row items-center mb-6 gap-4">
            {investor.investor_logo ? (
              <Image
                src={investor.investor_logo}
                alt={investor.investor_name}
                width={128}
                height={128}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-gray-400 text-3xl font-bold">
                  {investor.investor_name?.charAt(0) || "?"}
                </span>
              </div>
            )}
            <div className="flex flex-col w-full text-center sm:text-right">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {investor.investor_name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {investor.investor_description}
              </p>
            </div>
          </div>

          {/* Investments section */}
          {investor.investor_startups &&
            investor.investor_startups.length > 0 && (
              <div className="mb-8 text-center sm:text-right">
                <h2 className="text-2xl font-semibold mb-4">
                  الشركات المستثمر فيها
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {investor.investor_startups.map((startup) => (
                    <div
                      key={startup.id}
                      className="bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <Link href={`/${startup.id}`} className="block">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 mb-3">
                            {startup.startup_logo ? (
                              <Image
                                src={startup.startup_logo}
                                alt={startup.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-contain rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-xl font-bold">
                                  {startup.name?.charAt(0) || "?"}
                                </span>
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg text-center">
                            {startup.name}
                          </h3>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Visit button */}
          {investor.investor_website && (
            <div className="flex justify-center">
              <a
                href={investor.investor_website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-base font-medium w-full sm:w-auto text-center flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                زيارة موقعهم
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
