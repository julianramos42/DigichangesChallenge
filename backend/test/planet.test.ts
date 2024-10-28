import insertManyPlanets from '../src/services/planets/create';
import getPlanetsFromDB from '../src/services/planets/getFromDB';
import checkDuplicates from '../src/middlewares/planets/checkDuplicates';
import Planet from '../src/models/Planet';
import { PlanetData } from '../src/models/Planet';

const tatooine = {
    "name": "Tatooine",
    "diameter": "10465",
    "rotation_period": "23",
    "orbital_period": "304",
    "gravity": "1 standard",
    "population": "200000",
    "climate": "arid",
    "terrain": "desert",
    "surface_water": "1",
    "residents": [
        "https://swapi.dev/api/people/1/",
        "https://swapi.dev/api/people/2/",
        "https://swapi.dev/api/people/4/",
        "https://swapi.dev/api/people/6/",
        "https://swapi.dev/api/people/7/",
        "https://swapi.dev/api/people/8/",
        "https://swapi.dev/api/people/9/",
        "https://swapi.dev/api/people/11/",
        "https://swapi.dev/api/people/43/",
        "https://swapi.dev/api/people/62/"
    ],
    "films": [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/3/",
        "https://swapi.dev/api/films/4/",
        "https://swapi.dev/api/films/5/",
        "https://swapi.dev/api/films/6/"
    ],
    "url": "https://swapi.dev/api/planets/1/",
    "__v": 0,
    "createdAt": new Date("2024-10-28T05:03:24.347Z"),
    "updatedAt": new Date("2024-10-28T05:03:24.347Z")
}

const coruscant = {
    "name": "Coruscant",
    "diameter": "12240",
    "rotation_period": "24",
    "orbital_period": "368",
    "gravity": "1 standard",
    "population": "1000000000000",
    "climate": "temperate",
    "terrain": "cityscape, mountains",
    "surface_water": "unknown",
    "residents": [
        "https://swapi.dev/api/people/34/",
        "https://swapi.dev/api/people/55/",
        "https://swapi.dev/api/people/74/"
    ],
    "films": [
        "https://swapi.dev/api/films/3/",
        "https://swapi.dev/api/films/4/",
        "https://swapi.dev/api/films/5/",
        "https://swapi.dev/api/films/6/"
    ],
    "url": "https://swapi.dev/api/planets/9/",
    "__v": 0,
    "createdAt": new Date("2024-10-28T05:03:24.347Z"),
    "updatedAt": new Date("2024-10-28T05:03:24.347Z")
}

// Mocks de Mongoose
jest.mock('../src/models/Planet');

describe('Read & Save Service', () => {
    it("Debe guardar los planetas y devolver la cantidad guardada", async () => {
        const data: PlanetData[] = [tatooine, coruscant];

        // Simula una inserción exitosa
        (Planet.insertMany as jest.Mock).mockResolvedValue(data);

        const result = await insertManyPlanets(data);

        expect(result).toBe(2); // Debe retornar la cantidad de planetas insertadas
        expect(Planet.insertMany).toHaveBeenCalledWith(data); // Verifica que se llame con los datos correctos
    });

    it("Debe manejar un error y devolver null", async () => {
        const data: PlanetData[] = [tatooine, coruscant];

        // Simula un error en la inserción
        (Planet.insertMany as jest.Mock).mockRejectedValue(new Error("Database error"));

        const result = await insertManyPlanets(data);

        expect(result).toBeNull(); // Debe retornar null en caso de error
        expect(Planet.insertMany).toHaveBeenCalledWith(data); // Verifica que se llame con los datos correctos
    });

    it('Debe filtrar datos duplicados y devolver solo los elementos únicos', async () => {
        // Datos de prueba con un duplicado
        const data: PlanetData[] = [tatooine, coruscant, tatooine];

        // Para que detecte el duplicado de tatooine
        (Planet.exists as jest.Mock)
            .mockResolvedValueOnce(true)   // El primer tatooine ya existe en la base de datos
            .mockResolvedValueOnce(false)  // coruscant no existe en la base de datos
            .mockResolvedValueOnce(true);  // El segundo tatooine ya existe en la base de datos

        const result = await checkDuplicates(data);

        // Solo coruscant debería estar en el resultado, ya que es único
        expect(result).toEqual([coruscant]);
        expect(Planet.exists).toHaveBeenCalledTimes(3); // Llamado 3 veces, una por cada elemento
    });

    it("Debe retornar todos los documentos en la colección y el conteo total", async () => {
        const mockPlanet = [tatooine, coruscant];
        const paginationOptions = { filter: {}, pagination: { page: 1, limit: 10 }, skip: 0 };

        // Simula el conteo total de documentos
        (Planet.countDocuments as jest.Mock).mockResolvedValue(mockPlanet.length);
        // Simula la devolución de todos los documentos
        (Planet.find as jest.Mock).mockImplementation(() => ({
            skip: jest.fn().mockImplementation(() => ({
                limit: jest.fn().mockResolvedValue(mockPlanet.slice(paginationOptions.skip, paginationOptions.pagination.limit)),
            })),
        }));

        const result = await getPlanetsFromDB(paginationOptions);

        expect(result.success).toBe(true);
        expect(result.count).toBe(mockPlanet.length);
        expect(result.results).toEqual(mockPlanet);
        expect(result.status).toBe(200);
    });

    it("Debe retornar un arreglo vacío y count 0 si la colección está vacía", async () => {
        // Simula el conteo de 0 documentos y un arreglo vacío
        (Planet.countDocuments as jest.Mock).mockResolvedValue(0);
        (Planet.find as jest.Mock).mockResolvedValue([]);

        const options = { filter: {}, pagination: { page: 1, limit: 10 }, skip: 0 };
        const result = await getPlanetsFromDB(options);

        expect(result.success).toBe(false);
        expect(result.count).toBe(0);
        expect(result.results).toEqual([]);
        expect(result.status).toBe(404);
    });
});
