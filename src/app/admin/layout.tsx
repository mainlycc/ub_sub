import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#EAE7FC]">
      {/* Górny pasek nawigacji */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                Panel Administratorski
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <form action="/api/admin/logout" method="post">
                <Button type="submit" variant="outline" size="sm" className="flex items-center gap-2">
                  <LogOut size={16} />
                  Wyloguj
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Główna zawartość */}
      <main>
        {children}
      </main>
    </div>
  );
}
