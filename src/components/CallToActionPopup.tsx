"use client"

import { useEffect, useState } from "react"
import { Phone, Sparkles, X } from "lucide-react"

export const CallToActionPopup = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Pokaż popup po 10 sekundach od załadowania strony
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative w-[320px] p-0 shadow-xl border-none bg-gradient-to-br from-[#300FE6] to-[#1A0B8C] text-white rounded-xl overflow-hidden">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 z-10 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-yellow-300 font-semibold">SPECJALNA OFERTA!</span>
          </div>
          
          <h3 className="text-xl font-bold mb-2">
            Indywidualna wycena ubezpieczenia GAP
          </h3>
          
          <p className="text-white/80 text-sm mb-4">
            Zadzwoń i sprawdź, ile możesz zaoszczędzić
          </p>

          <a 
            href="tel:+48796148577" 
            className="flex items-center justify-center gap-2 w-full bg-white text-[#300FE6] font-semibold py-3 px-4 rounded-lg hover:bg-white/90 transition-colors"
          >
            <Phone className="w-5 h-5" />
            +48 796 148 577
          </a>

          <p className="text-white/60 text-xs text-center mt-3">
            Od poniedziałku do piątku<br />
            8:00 - 20:00
          </p>
        </div>
      </div>
    </div>
  )
} 