"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, FilterIcon, Menu, X } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link';
import NothingFound from '../components/NothingFound/NothingFound';

interface StarshipData {
  name: string;
  model: string;
  starship_class: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  hyperdrive_rating: string;
  MGLT: string;
  cargo_capacity: string;
  consumables: string;
  films: string[];
  pilots: string[];
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const availablesFilters = ['Name', 'Model', 'Starship_Class', 'Manufacturer'];
type FilterKeys = typeof availablesFilters[number];
type Filters = Partial<Record<FilterKeys, string>>;

export default function StarshipsList() {
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [starships, setStarships] = useState<StarshipData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState('');
  const [previousPage, setPreviousPage] = useState('');
  const [filters, setFilters] = useState<Filters>({});

  async function fetchStarships(page: string) {
    try {
      const filteredFilters = Object.fromEntries(
        Object.entries(filters).filter(([x, value]) => value !== undefined).map(([key, value]) => [key.toLowerCase(), value?.toLowerCase()])
      ) as Record<string, string>;

      const queryString = new URLSearchParams(filteredFilters).toString();
      const url = page ? page : `${process.env.NEXT_PUBLIC_API_URL}/starships?${queryString}`;

      const res = await axios.get(url);
      const data = res.data;

      setNextPage(data.next);
      setPreviousPage(data.previous);
      setStarships(data.results);
    } catch (err) {
      console.log('Error:' + err);
      setStarships([]);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    fetchStarships('');
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
      const url = queryString.includes('page') ? `${process.env.NEXT_PUBLIC_API_URL}/starships?${queryString}` : `${process.env.NEXT_PUBLIC_API_URL}/starships?page=${page}${queryString}`;
      setCurrentPage(page);

      fetchStarships(url);
    } else if (page === 'next' && nextPage) {
      setCurrentPage(currentPage + 1);
      const pageNumber = nextPage.slice(-1);
      setFilters({
        ...filters,
        page: String(pageNumber)
      })
      fetchStarships(nextPage);
    } else if (page === 'prev' && previousPage) {
      setCurrentPage(currentPage - 1);
      const pageNumber = previousPage.slice(-1);
      setFilters({
        ...filters,
        page: String(pageNumber)
      })
      fetchStarships(previousPage);
    }
  }

  function clearFilters(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    setFilters({});

    const url = `${process.env.NEXT_PUBLIC_API_URL}/starships?page=${currentPage}`;
    fetchStarships(url);
  }

  useEffect(() => {
    fetchStarships('');
  }, []);

  return (
    <div className="md:h-[90vh] flex flex-col">

      <main className="flex-grow flex flex-col md:flex-row items-start">

        {/* FILTRO */}
        <div className="w-full md:w-64 bg-primary p-4 border-r md:h-full">

          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold text-primaryForeground ${isMainMenuOpen ? 'block' : 'hidden'} md:block`}>Filter By:</h2>
            <button className="md:hidden transition-transform duration-300 hover:scale-110" onClick={() => setIsMainMenuOpen(!isMainMenuOpen)}>
              {isMainMenuOpen ? <X size={24} /> : <FilterIcon size={36} className='rounded shadow p-2' />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className={`flex gap-2 flex-col ${isMainMenuOpen ? 'flex' : 'hidden'} md:flex`}>
            <div className={`flex flex-wrap gap-2 items-center md:flex-col ${isMainMenuOpen ? 'flex' : 'hidden'} md:flex`}>
              {availablesFilters.map((availableFilter, index) => (
                <div key={index} className="flex flex-col bg-background p-2 m-0 rounded text-foreground">
                  <label>{availableFilter}:</label>
                  <input type='text' value={filters[availableFilter] || ''}
                    onChange={(e) => handleInputChange(e, availableFilter)}
                    className="border rounded p-1 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                  />
                </div>
              ))}
            </div>
            <div className='flex gap-2'>
              <input
                type='submit'
                value={'Search'}
                className='bg-background font-medium text-foreground px-2 py-1 rounded text-sm w-20 transition-all duration-300 hover:bg-primaryDark hover:text-primaryDarkForeground hover:scale-105 cursor-pointer'
              />
              <button
                className='bg-background font-medium text-foreground px-2 py-1 rounded text-sm w-20 transition-all duration-300 hover:bg-primaryDark hover:text-primaryDarkForeground hover:scale-105'
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </form>

        </div>

        {/* CARDS SECTION */}
        <section className="flex-grow p-4">
          <h2 className="p-4 font-bold text-3xl text-title">Starships: </h2>

          {
            starships.length ?
              <div className="flex-grow p-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {
                  starships.map((item, index) => (
                    <div key={index} className="bg-card text-cardForeground p-4 rounded-lg shadow min-h-20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <div className="text-md flex gap-2">
                        <h5 className='font-semibold'>Model:</h5>
                        <p>{item.model.charAt(0).toUpperCase() + item.model.slice(1)}</p>
                      </div>
                      <div className="text-md flex gap-2">
                        <h5 className='font-semibold'>Director:</h5>
                        <p>{item.starship_class.charAt(0).toUpperCase() + item.starship_class.slice(1)}</p>
                      </div>
                      <div className="text-md flex gap-2">
                        <h5 className='font-semibold'>Manufacturer:</h5>
                        <p>{item.manufacturer.charAt(0).toUpperCase() + item.manufacturer.slice(1)}</p>
                      </div>
                      <Link
                        href={`/starships/${item.url.split('/')[item.url.split('/').length - 2]}`} // divide la url en secciones y obtenemos el numero que esta entre los / / finales
                      ><button className="text-sm text-muted rounded shadow-md p-2 hover:text-primaryForeground transition-colors duration-300">See Details</button></Link>
                    </div>
                  ))
                }
              </div>
              :
              <NothingFound />
          }

          {/* PAGINATION */}
          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={!previousPage}
              className={`p-2 rounded ${previousPage ? 'bg-primary text-primaryForeground hover:bg-primaryDark hover:text-primaryDarkForeground hover:scale-110' : 'bg-gray-100 text-gray-400'}`}
            >
              <ChevronLeft size={20} />
            </button>

            {[currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2].map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                hidden={page < 1 || (page > currentPage && !nextPage)}
                className={`w-8 h-8 rounded ${page === currentPage ? 'bg-gray-200 text-foreground' : 'hover:bg-primaryDark hover:text-primaryDarkForeground hover:scale-110'}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange('next')}
              disabled={!nextPage}
              className={`p-2 rounded ${nextPage ? 'bg-primary text-primaryForeground hover:bg-primaryDark hover:text-primaryDarkForeground hover:scale-110' : 'bg-gray-200 text-gray-400'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

      </main>

    </div>
  )
}