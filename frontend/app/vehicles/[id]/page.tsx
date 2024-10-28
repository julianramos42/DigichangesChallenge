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

interface VehicleData {
    name: string;
    model: string;
    vehicle_class: string;
    manufacturer: string;
    length: string;
    cost_in_credits: string;
    crew: string;
    passengers: string;
    max_atmosphering_speed: string;
    cargo_capacity: string;
    consumables: string;
    films: string[];
    pilots: string[];
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default function VehicleDetail({ params }: Params) {
    const [vehicle, setVehicle] = useState<VehicleData | null>(null);
    const { id } = params;

    async function fetchVehicle() {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vehicles?url=${id}`);
            const itemData = res.data.results[0]
            // Elimina propiedades que no necesitamos o no queremos exponer
            delete itemData._id
            delete itemData.createdAt
            delete itemData.updatedAt
            delete itemData.url
            delete itemData.__v
            setVehicle(itemData);
        } catch (err) {
            console.error('Error fetching vehicle:', err);
            setVehicle(null)
        }
    }

    useEffect(() => {
        fetchVehicle();
    }, [id]);

    if (!vehicle) {
        return <div className="flex justify-center items-center h-[90vh]">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-primary p-8">
            <Link href="/vehicles" className="inline-flex items-center text-title hover:text-black transition-colors mb-6">
                <ChevronLeft className="mr-2" />
                Back to Vehicles
            </Link>
            <h1 className="text-4xl font-bold mb-6 text-center">{vehicle.name}</h1>
            <div className="max-w-4xl mx-auto bg-card border shadow-2xl rounded-lg overflow-hidden">
                <table className="w-full">
                    <tbody>
                        {Object.entries(vehicle).map(([key, value]) => {
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