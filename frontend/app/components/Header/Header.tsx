'use client'

import { useState } from "react";
import Image from 'next/image'
import logo from '../../../assets/images/logo.svg'
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const categories = ["Films", 'People', "Planets", "Starships", "Species", "Vehicles"];

  return (
    <header className="bg-primary text-primaryForeground p-4 border-b md:h-[10vh] flex flex-col gap-4 sm:gap-0 sm:flex-row sm:justify-between sm:items-center">

      <Link href={'/'}><Image src={logo} width={77} height={44} alt='logo' /></Link>
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex space-x-2">
          {categories.map((categorie, index) => (
            <div key={index} className="bg-background font-medium text-foreground px-2 py-1 rounded text-sm transition-all duration-300 hover:bg-primaryDark hover:text-primaryDarkForeground hover:scale-105 cursor-pointer">
              <Link href={`/${categorie.toLowerCase()}`}>{categorie}</Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 md:hidden">
        {isHeaderMenuOpen && (
          <div>
            <div className="flex flex-wrap gap-2">
              {categories.map((categorie, index) => (
                <div key={index} className="bg-background font-medium text-foreground px-2 py-1 rounded text-sm transition-all duration-300 hover:bg-primaryDark hover:text-primaryDarkForeground hover:scale-105 cursor-pointer">
                  <Link href={`/${categorie.toLowerCase()}`}>{categorie}</Link>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}>
          {isHeaderMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}