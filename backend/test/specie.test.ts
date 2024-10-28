import insertManySpecies from '../src/services/species/create';
import getSpeciesFromDB from '../src/services/species/getFromDB';
import checkDuplicates from '../src/middlewares/species/checkDuplicates';
import Specie from '../src/models/Specie';
import { SpecieData } from '../src/models/Specie';

const human = {
    "name": "Human",
    "classification": "mammal",
    "designation": "sentient",
    "average_height": "180",
    "average_lifespan": "120",
    "eye_colors": "brown, blue, green, hazel, grey, amber",
    "hair_colors": "blonde, brown, black, red",
    "skin_colors": "caucasian, black, asian, hispanic",
    "language": "Galactic Basic",
    "homeworld": "https://swapi.dev/api/planets/9/",
    "people": [
        "https://swapi.dev/api/people/66/",
        "https://swapi.dev/api/people/67/",
        "https://swapi.dev/api/people/68/",
        "https://swapi.dev/api/people/74/"
    ],
    "films": [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/2/",
        "https://swapi.dev/api/films/3/",
        "https://swapi.dev/api/films/4/",
        "https://swapi.dev/api/films/5/",
        "https://swapi.dev/api/films/6/"
    ],
    "url": "https://swapi.dev/api/species/1/",
    "__v": 0,
    "createdAt": new Date("2024-10-28T05:03:30.594Z"),
    "updatedAt": new Date("2024-10-28T05:03:30.594Z")
}

const hutt = {
    "name": "Hutt",
    "classification": "gastropod",
    "designation": "sentient",
    "average_height": "300",
    "average_lifespan": "1000",
    "eye_colors": "yellow, red",
    "hair_colors": "n/a",
    "skin_colors": "green, brown, tan",
    "language": "Huttese",
    "homeworld": "https://swapi.dev/api/planets/24/",
    "people": [
        "https://swapi.dev/api/people/16/"
    ],
    "films": [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/3/"
    ],
    "url": "https://swapi.dev/api/species/5/",
    "__v": 0,
    "createdAt": new Date("2024-10-28T05:03:30.595Z"),
    "updatedAt": new Date("2024-10-28T05:03:30.595Z")
}

// Mocks de Mongoose
jest.mock('../src/models/Specie');

describe('Read & Save Service', () => {
    it("Debe guardar las especies y devolver la cantidad guardada", async () => {
        const data: SpecieData[] = [human, hutt];

        // Simula una inserción exitosa
        (Specie.insertMany as jest.Mock).mockResolvedValue(data);

        const result = await insertManySpecies(data);

        expect(result).toBe(2); // Debe retornar la cantidad de especies insertadas
        expect(Specie.insertMany).toHaveBeenCalledWith(data); // Verifica que se llame con los datos correctos
    });

    it("Debe manejar un error y devolver null", async () => {
        const data: SpecieData[] = [human, hutt];

        // Simula un error en la inserción
        (Specie.insertMany as jest.Mock).mockRejectedValue(new Error("Database error"));

        const result = await insertManySpecies(data);

        expect(result).toBeNull(); // Debe retornar null en caso de error
        expect(Specie.insertMany).toHaveBeenCalledWith(data); // Verifica que se llame con los datos correctos
    });

    it('Debe filtrar datos duplicados y devolver solo los elementos únicos', async () => {
        // Datos de prueba con un duplicado
        const data: SpecieData[] = [human, hutt, human];

        // Para que detecte el duplicado de human
        (Specie.exists as jest.Mock)
            .mockResolvedValueOnce(true)   // El primer human ya existe en la base de datos
            .mockResolvedValueOnce(false)  // hutt no existe en la base de datos
            .mockResolvedValueOnce(true);  // El segundo human ya existe en la base de datos

        const result = await checkDuplicates(data);

        // Solo hutt debería estar en el resultado, ya que es único
        expect(result).toEqual([hutt]);
        expect(Specie.exists).toHaveBeenCalledTimes(3); // Llamado 3 veces, una por cada elemento
    });

    it("Debe retornar todos los documentos en la colección y el conteo total", async () => {
        const mockSpecie = [human, hutt];
        const paginationOptions = { filter: {}, pagination: { page: 1, limit: 10 }, skip: 0 };

        // Simula el conteo total de documentos
        (Specie.countDocuments as jest.Mock).mockResolvedValue(mockSpecie.length);
        // Simula la devolución de todos los documentos
        (Specie.find as jest.Mock).mockImplementation(() => ({
            skip: jest.fn().mockImplementation(() => ({
                limit: jest.fn().mockResolvedValue(mockSpecie.slice(paginationOptions.skip, paginationOptions.pagination.limit)),
            })),
        }));

        const result = await getSpeciesFromDB(paginationOptions);

        expect(result.success).toBe(true);
        expect(result.count).toBe(mockSpecie.length);
        expect(result.results).toEqual(mockSpecie);
        expect(result.status).toBe(200);
    });

    it("Debe retornar un arreglo vacío y count 0 si la colección está vacía", async () => {
        // Simula el conteo de 0 documentos y un arreglo vacío
        (Specie.countDocuments as jest.Mock).mockResolvedValue(0);
        (Specie.find as jest.Mock).mockResolvedValue([]);

        const options = { filter: {}, pagination: { page: 1, limit: 10 }, skip: 0 };
        const result = await getSpeciesFromDB(options);

        expect(result.success).toBe(false);
        expect(result.count).toBe(0);
        expect(result.results).toEqual([]);
        expect(result.status).toBe(404);
    });
});
