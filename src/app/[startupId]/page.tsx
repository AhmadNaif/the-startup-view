"use client";

import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { startup_details } from "@/types/startup_details";
import {
  handleError,
  formatErrorMessage,
  NotFoundError,
} from "@/utils/error-handler";

export default function StartupDetails() {
  const params = useParams();
  const startupId = params.startupId as string;
  const [startup, setStartup] = useState<startup_details | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStartupDetails() {
      if (!startupId) return;

      setLoading(true);
      try {
        const startupDoc = await getDoc(doc(db, `startups/${startupId}`));

        if (!startupDoc.exists()) {
          throw new NotFoundError("Startup");
        }

        setStartup(startupDoc.data() as startup_details);
      } catch (err) {
        const appError = handleError(err);
        console.error("Error fetching startup details:", appError);
        setError(formatErrorMessage(appError));
      } finally {
        setLoading(false);
      }
    }

    fetchStartupDetails();
  }, [startupId]);

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
          href="/"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          العودة للصفحة الرئيسية
        </Link>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="p-4 flex flex-col justify-center items-center min-h-screen">
        <div className="text-2xl">لم يتم العثور على الشركة الناشئة</div>
        <Link
          href="/"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          العودة للصفحة الرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 text-right">
        <Link href="/" className="text-blue-500 hover:underline">
          العودة للصفحة الرئيسية &rarr;
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          {/* Logo and Name at the top */}
          <div className="flex flex-col sm:flex-row items-center mb-6 gap-4">
            <Image
              src={startup.startup_logo}
              alt={startup.startup_name}
              width={80}
              height={80}
              className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded-md"
            />
            <div className="flex flex-col w-full text-center sm:text-right">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                {startup.startup_name}
              </h1>
            </div>
          </div>

          {/* Investors section */}
          {startup.startup_investors &&
            startup.startup_investors.length > 0 && (
              <div className="mb-6 text-center sm:text-right">
                <h2 className="text-lg font-semibold mb-2">
                  المستثمرين فيها ..
                </h2>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {startup.startup_investors.map((investor, index) => (
                    <Link
                      key={index}
                      href={`/investors/${investor.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      <div className="bg-blue-100 text-blue-800 px-3 sm:px-4 py-1.5 rounded-full text-sm sm:text-base">
                        {investor.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          {/* Description */}
          <p className="text-gray-700 text-base sm:text-lg mb-6 text-center sm:text-right">
            {startup.startup_description}
          </p>

          {/* Information boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-200 p-3 rounded-md text-center">
              <h3 className="font-semibold text-gray-700 text-sm">الدولة</h3>
              <p className="text-sm">{startup.startup_country}</p>
            </div>

            <div className="bg-gray-200 p-3 rounded-md text-center">
              <h3 className="font-semibold text-gray-700 text-sm">القطاع</h3>
              <p className="text-sm">{startup.startup_industry}</p>
            </div>
          </div>

          {/* Visit button */}
          <div className="flex justify-center">
            <a
              href={startup.startup_website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-4 sm:px-6 py-2 rounded-full hover:bg-gray-800 transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
            >
              زيارة موقعهم
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
