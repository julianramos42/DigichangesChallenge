'use client'

import { useState } from "react";
import Image from 'next/image'
import logo from '../../../assets/images/logo.svg'
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const categories = ['People', "Films", "Planets", "Starships", "Species", "Vehicles"];

  return (
    <header className="bg-primary text-primaryForeground p-4 border-b">
      <div className="flex justify-between items-center">
        <Link href={'/'}><Image src={logo} width={77} height={44} alt='logo' /></Link>
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex space-x-2">
            {categories.map((categorie, index) => (
              <div key={index} className="bg-background font-semibold text-foreground px-2 py-1 rounded text-sm">
                <Link href={`/${categorie.toLowerCase()}`}>{categorie}</Link>
              </div>
            ))}
          </div>
        </div>
        <button className="md:hidden" onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}>
          {isHeaderMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isHeaderMenuOpen && (
        <div className="mt-4 md:hidden">
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-background text-foreground px-2 py-1 rounded text-sm">
                Filtro {index + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}