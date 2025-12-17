"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Cookie, X } from "lucide-react"
import Link from "next/link"

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Sprawdź czy użytkownik już zaakceptował cookies
    const cookieConsent = localStorage.getItem("cookieConsent")
    if (!cookieConsent) {
      // Pokaż banner po krótkim opóźnieniu dla lepszego UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted")
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              <Cookie className="w-6 h-6 text-[#300FE6]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Pliki cookies
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Ta strona wykorzystuje pliki cookies w celu zapewnienia prawidłowego działania, 
                analizy ruchu i personalizacji treści. Kontynuując przeglądanie, wyrażasz zgodę 
                na ich użycie.
              </p>
              <Link 
                href="/polityka-prywatnosci" 
                className="text-sm text-[#300FE6] hover:underline"
              >
                Dowiedz się więcej
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleReject}
              className="flex-1 sm:flex-initial"
            >
              Odrzuć
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1 sm:flex-initial bg-[#300FE6] hover:bg-[#2208B0]"
            >
              Akceptuję
            </Button>
            <button
              onClick={handleReject}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors sm:hidden"
              aria-label="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

