'use client'

import { useState, useEffect, use } from 'react'
import { ChevronLeft } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link'

type Params = Promise<{ id: string }>

interface SpecieData {
    name: string;
    classification: string;
    designation: string;
    average_height: string;
    average_lifespan: string;
    eye_colors: string;
    hair_colors: string;
    skin_colors: string;
    language: string;
    homeworld?: string;
    people: string[];
    films: string[];
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default function SpecieDetail(props: { params: Params }) {
    const [specie, setSpecie] = useState<SpecieData | null>(null);
    const { id } = use(props.params);

    async function fetchSpecie() {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/species?url=${id}`);
            const itemData = res.data.results[0]
            // Elimina propiedades que no necesitamos o no queremos exponer
            delete itemData._id
            delete itemData.createdAt
            delete itemData.updatedAt
            delete itemData.url
            delete itemData.__v
            setSpecie(itemData);
        } catch (err) {
            console.error('Error fetching specie:', err);
            setSpecie(null)
        }
    }

    useEffect(() => {
        fetchSpecie();
    }, [id]);

    if (!specie) {
        return <div className="flex justify-center items-center h-[90vh]">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-primary p-8">
            <Link href="/species" className="inline-flex items-center text-title hover:text-black transition-colors mb-6">
                <ChevronLeft className="mr-2" />
                Back to Species
            </Link>
            <h1 className="text-4xl font-bold mb-6 text-center">{specie.name}</h1>
            <div className="max-w-4xl mx-auto bg-card border shadow-2xl rounded-lg overflow-hidden">
                <table className="w-full">
                    <tbody>
                        {Object.entries(specie).map(([key, value]) => {
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