// Función para reemplazar URLs en arrays y objetos

// Sinceramente no pude hacer esta función sin el uso de any.
export default function replaceUrlsWithCustom(obj: any): any {
    // Si el objeto tiene la propiedad 'url', la reemplaza
    if (obj.url && typeof obj.url === 'string') {
        obj.url = obj.url.replace('https://swapi.dev', process.env.OUR_URL as string);
    }

    if (obj.homeworld && typeof obj.homeworld === 'string') {
        obj.homeworld = obj.homeworld.replace('https://swapi.dev', process.env.OUR_URL as string);
    }

    // Recorre las propiedades del objeto
    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            // Si es array, recorre cada elemento y aplica la función recursivamente
            obj[key] = obj[key].map((item: any) => {
                if (typeof item === 'object' && item !== null) {
                    return replaceUrlsWithCustom(item);
                } else if (typeof item === 'string' && item.includes('https://swapi.dev')) {
                    // Si el item es una URL string, la reemplaza
                    return item.replace('https://swapi.dev', process.env.OUR_URL as string);
                }
                return item;
            });
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            // Si es un objeto, aplica la función recursivamente
            replaceUrlsWithCustom(obj[key]);
        }
    }
    return obj;
}
