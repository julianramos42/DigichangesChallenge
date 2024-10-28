"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link';

interface PeopleData {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld?: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const availablesFilters = ['Name', 'Gender'];
type FilterKeys = typeof availablesFilters[number];
type Filters = Partial<Record<FilterKeys, string>>;

export default function Component() {
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [people, setPeople] = useState<PeopleData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState('');
  const [previousPage, setPreviousPage] = useState('');
  const [filters, setFilters] = useState<Filters>({});

  async function fetchPeople(page: string) {
    try {
      const filteredFilters = Object.fromEntries(
        Object.entries(filters).filter(([x, value]) => value !== undefined).map(([key, value]) => [key.toLowerCase(), value?.toLowerCase()])
      ) as Record<string, string>;

      const queryString = new URLSearchParams(filteredFilters).toString();
      const url = page ? page : `${process.env.NEXT_PUBLIC_API_URL}/people?${queryString}`;

      const res = await axios.get(url);
      const data = res.data;
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setPeople(data.results);
    } catch (err) {
      console.log('Error:' + err);
      setPeople([]);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    fetchPeople('');
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>, filter: FilterKeys) {
    setFilters({
      ...filters,
      [filter]: e.target.value
    });
  }

  function handlePageChange(page: number | string) {
    if (typeof page === 'number') {
      setFilters({
        ...filters,
        page: String(page)
      })
      const auxFilters = {
        ...filters,
        page: String(page)
      }

      const filteredFilters = Object.fromEntries(
        Object.entries(auxFilters).filter(([x, value]) => value !== undefined).map(([key, value]) => [key.toLowerCase(), value?.toLowerCase()])
      ) as Record<string, string>;

      const queryString = new URLSearchParams(filteredFilters).toString();
      const url = queryString.includes('page') ? `${process.env.NEXT_PUBLIC_API_URL}/people?${queryString}` : `${process.env.NEXT_PUBLIC_API_URL}/people?page=${page}${queryString}`;
      setCurrentPage(page);

      fetchPeople(url);
    } else if (page === 'next' && nextPage) {
      setCurrentPage(currentPage + 1);
      const pageNumber = nextPage.slice(-1);
      setFilters({
        ...filters,
        page: String(pageNumber)
      })
      fetchPeople(nextPage);
    } else if (page === 'prev' && previousPage) {
      setCurrentPage(currentPage - 1);
      const pageNumber = previousPage.slice(-1);
      setFilters({
        ...filters,
        page: String(pageNumber)
      })
      fetchPeople(previousPage);
    }
  }

  useEffect(() => {
    fetchPeople('');
  }, []);

  return (
    <div className="min-h-full flex flex-col">

      <main className="flex-grow flex flex-col md:flex-row items-start">

        {/* CARDS SECTION */}
        <section className="flex-grow p-4">
          <h2 className="p-4 font-semibold text-3xl">People: </h2>

          {
            people.length ?
              <div className="flex-grow p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                {
                  people.map((item, index) => (
                    <div key={index} className="bg-card text-cardForeground p-4 rounded-lg shadow max-h-20">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <Link href={''}><button className="text-sm text-muted">See Details</button></Link>
                    </div>
                  ))
                }
              </div>
              :
              <div className="flex-grow p-4">
                <div className="text-cardForeground p-4 rounded-lg gap-3 max-h-40 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold">Nothing Found</h3>
                  <p className="text-sm text-muted">Try going back to page 1 or clearing the filters.</p>
                </div>
              </div>
          }

          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={!previousPage}
              className={`p-2 rounded ${previousPage ? 'bg-gray-300 text-foreground' : 'bg-gray-100 text-gray-400'}`}
            >
              <ChevronLeft size={20} />
            </button>

            {[currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2].map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                hidden={page < 1 || (page > currentPage && !nextPage)}
                className={`w-8 h-8 rounded ${page === currentPage ? 'bg-primary text-primaryForeground' : 'bg-gray-300 text-foreground'}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange('next')}
              disabled={!nextPage}
              className={`p-2 rounded ${nextPage ? 'bg-gray-300 text-foreground' : 'bg-gray-200 text-gray-400'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* FILTRO */}
        <div className="md:w-64 bg-primary p-4 border-l min-h-screen">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-primaryForeground">Filter By:</h2>
            <button className="md:hidden" onClick={() => setIsMainMenuOpen(!isMainMenuOpen)}>
              {isMainMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className={`space-y-2 ${isMainMenuOpen ? 'block' : 'hidden'} md:block`}>
            {availablesFilters.map((availableFilter, index) => (
              <div key={index} className="flex flex-col bg-background p-2 rounded text-foreground">
                <label>{availableFilter}:</label>
                <input type='text' value={filters[availableFilter] || ''}
                  onChange={(e) => handleInputChange(e, availableFilter)}
                  className="border rounded p-1" />
              </div>
            ))}
            <input type='submit' value={'Search'} className='bg-background font-semibold text-foreground px-2 py-1 rounded text-sm' />
          </form>

        </div>

      </main>

    </div>
  )
}