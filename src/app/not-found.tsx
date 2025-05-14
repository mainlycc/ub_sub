import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EAE7FC]">
      <h1 className="text-5xl font-bold text-[#300FE6] mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Nie znaleziono strony</h2>
      <p className="mb-6 text-gray-700">Przepraszamy, ale taka strona nie istnieje.</p>
      <Link href="/" className="text-[#300FE6] underline">Wróć na stronę główną</Link>
    </div>
  );
} 