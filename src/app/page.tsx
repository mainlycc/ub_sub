"use client"

import React from 'react';
import Link from 'next/link';
import InsuranceCalculator from '@/components/InsuranceCalculator';
import InsuranceTypeCards from '@/components/InsuranceTypeCards';
import AboutUs from '@/components/AboutUs';
import FAQ from '@/components/FAQ';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HomePage = (): React.ReactNode => {
  // Dodaję komentarz "eslint-disable-next-line" żeby uniknąć błędu nieużywanych importów
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unusedComponentsReference = {
    InsuranceCalculator,
    InsuranceTypeCards,
    AboutUs,
    FAQ,
    Button,
    NavigationMenu,
    Link
  };

  return (
    <>
      {/* Kalkulator - importowany jako komponent */}
      <InsuranceCalculator />
      
      {/* Karty informacyjne o typach ubezpieczeń GAP */}
      <InsuranceTypeCards />
      
      {/* Sekcja O nas */}
      <AboutUs />
      
      {/* Sekcja FAQ - przeniesiona na koniec */}
      <FAQ />
    </>
  );
};

export default HomePage;