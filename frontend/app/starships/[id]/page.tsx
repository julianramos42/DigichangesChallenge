'use client'

import { useState, useEffect, use } from 'react'
import { ChevronLeft } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link'

type Params = Promise<{ id: string }>

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

export default function StarshipDetail(props: { params: Params }) {
    const [starship, setStarship] = useState<StarshipData | null>(null);
    const { id } = use(props.params);

    async function fetchStarship() {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/starships?url=${id}`);
            const itemData = res.data.results[0]
            // Elimina propiedades que no necesitamos o no queremos exponer
            delete itemData._id
            delete itemData.createdAt
            delete itemData.updatedAt
            delete itemData.url
            delete itemData.__v
            setStarship(itemData);
        } catch (err) {
            console.error('Error fetching starship:', err);
            setStarship(null)
        }
    }

    useEffect(() => {
        fetchStarship();
    }, [id]);

    if (!starship) {
        return <div className="flex justify-center items-center h-[90vh]">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-primary p-8">
            <Link href="/starships" className="inline-flex items-center text-title hover:text-black transition-colors mb-6">
                <ChevronLeft className="mr-2" />
                Back to Starships
            </Link>
            <h1 className="text-4xl font-bold mb-6 text-center">{starship.name}</h1>
            <div className="max-w-4xl mx-auto bg-card border shadow-2xl rounded-lg overflow-hidden">
                <table className="w-full">
                    <tbody>
                        {Object.entries(starship).map(([key, value]) => {
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