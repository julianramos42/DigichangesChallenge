"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, FilterIcon, Menu, X } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link';
import NothingFound from '../components/NothingFound/NothingFound';

interface FilmData {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: Date;
  species: string[];
  starships: string[];
  vehicles: string[];
  characters: string[];
  planets: string[];
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const availablesFilters = ['Title', 'Episode_Id', 'Director', 'Producer', 'Release_Date'];
type FilterKeys = typeof availablesFilters[number];
type Filters = Partial<Record<FilterKeys, string>>;

export default function FilmsList() {
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [films, setFilms] = useState<FilmData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState('');
  const [previousPage, setPreviousPage] = useState('');
  const [filters, setFilters] = useState<Filters>({});

  async function fetchFilms(page: string) {
    try {
      const filteredFilters = Object.fromEntries(
        Object.entries(filters).filter(([x, value]) => value !== undefined).map(([key, value]) => [key.toLowerCase(), value?.toLowerCase()])
      ) as Record<string, string>;

      const queryString = new URLSearchParams(filteredFilters).toString();
      const url = page ? page : `${process.env.NEXT_PUBLIC_API_URL}/films?${queryString}`;

      const res = await axios.get(url);
      const data = res.data;

      setNextPage(data.next);
      setPreviousPage(data.previous);
      setFilms(data.results);
    } catch (err) {
      console.log('Error:' + err);
      setFilms([]);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    fetchFilms('');
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
      const url = queryString.includes('page') ? `${process.env.NEXT_PUBLIC_API_URL}/films?${queryString}` : `${process.env.NEXT_PUBLIC_API_URL}/films?page=${page}${queryString}`;
      setCurrentPage(page);

      fetchFilms(url);
    } else if (page === 'next' && nextPage) {
      setCurrentPage(currentPage + 1);
      const pageNumber = nextPage.slice(-1);
      setFilters({
        ...filters,
        page: String(pageNumber)
      })
      fetchFilms(nextPage);
    } else if (page === 'prev' && previousPage) {
      setCurrentPage(currentPage - 1);
      const pageNumber = previousPage.slice(-1);
      setFilters({
        ...filters,
        page: String(pageNumber)
      })
      fetchFilms(previousPage);
    }
  }

  function clearFilters(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    setFilters({});

    const url = `${process.env.NEXT_PUBLIC_API_URL}/films?page=${currentPage}`;
    fetchFilms(url);
  }

  useEffect(() => {
    fetchFilms('');
  }, []);

  return (
    <div className="md:h-[90vh] flex flex-col">

      <main className="flex-grow flex flex-col md:flex-row items-start">

        {/* CARDS SECTION */}
        <section className="flex-grow p-4">
          <h2 className="p-4 font-bold text-3xl text-title">Films: </h2>

          {
            films.length ?
              <div className="flex-grow p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {
                  films.map((item, index) => (
                    <div key={index} className="bg-card text-cardForeground p-4 rounded-lg shadow min-h-20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <div className="text-md flex gap-2">
                        <h5 className='font-semibold'>Episode:</h5>
                        <p>{item.episode_id}</p>
                      </div>
                      <div className="text-md flex gap-2">
                        <h5 className='font-semibold'>Director:</h5>
                        <p>{item.director.charAt(0).toUpperCase() + item.director.slice(1)}</p>
                      </div>
                      <div className="text-md flex gap-2">
                        <h5 className='font-semibold'>Producer:</h5>
                        <p>{item.producer.charAt(0).toUpperCase() + item.producer.slice(1)}</p>
                      </div>
                      <div className="text-md flex gap-2">
                        <h5 className='font-semibold'>Release Date:</h5>
                        <p>{new Date(item.release_date).getFullYear()}</p>
                      </div>
                      <Link
                        href={`/films/${item.url.split('/')[item.url.split('/').length - 2]}`} // divide la url en secciones y obtenemos el numero que esta entre los / / finales
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

        {/* FILTRO */}
        <div className="w-full md:w-64 bg-primary p-4 border-l md:h-full">

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

      </main>

    </div>
  )
}