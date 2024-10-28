'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link'

interface Params {
    params: {
        id: string;
    };
}

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

export default function FilmDetail({ params }: Params) {
    const [film, setFilm] = useState<FilmData | null>(null);
    const { id } = params;

    async function fetchFilm() {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/films?url=${id}`);
            const itemData = res.data.results[0]
            // Elimina propiedades que no necesitamos o no queremos exponer
            delete itemData._id
            delete itemData.createdAt
            delete itemData.updatedAt
            delete itemData.url
            delete itemData.__v
            setFilm(itemData);
        } catch (err) {
            console.error('Error fetching film:', err);
            setFilm(null)
        }
    }

    useEffect(() => {
        fetchFilm();
    }, [id]);

    if (!film) {
        return <div className="flex justify-center items-center h-[90vh]">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-primary p-8">
            <Link href="/films" className="inline-flex items-center text-title hover:text-black transition-colors mb-6">
                <ChevronLeft className="mr-2" />
                Back to Films
            </Link>
            <h1 className="text-4xl font-bold mb-6 text-center">{film.title}</h1>
            <div className="max-w-4xl mx-auto bg-card border shadow-2xl rounded-lg overflow-hidden">
                <table className="w-full">
                    <tbody>
                        {Object.entries(film).map(([key, value]) => {
                            return (
                                <tr key={key} className="border-b last:border-b-0">
                                    <th className="text-left p-4 bg-primary text-primaryForeground font-semibold capitalize">{key.replace('_', ' ')}</th>
                                    <td className="p-4">
                                        {Array.isArray(value) ? (
                                            <ul className="list-disc list-inside">
                                                {value.map((item, index) => (
                                                    <li key={index} className="text-muted">{item}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-muted">{value || 'N/A'}</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}