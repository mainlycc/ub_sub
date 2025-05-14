"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Możesz tu dodać logowanie błędów do zewnętrznego serwisu
    // console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EAE7FC]">
      <h1 className="text-5xl font-bold text-red-600 mb-4">Coś poszło nie tak</h1>
      <h2 className="text-2xl font-semibold mb-2">Wystąpił nieoczekiwany błąd</h2>
      <p className="mb-6 text-gray-700">Przepraszamy za niedogodności. Spróbuj odświeżyć stronę lub wrócić na stronę główną.</p>
      <div className="flex gap-4">
        <button onClick={() => reset()} className="px-4 py-2 bg-[#300FE6] text-white rounded">Spróbuj ponownie</button>
        <Link href="/" className="text-[#300FE6] underline">Strona główna</Link>
      </div>
    </div>
  );
} 