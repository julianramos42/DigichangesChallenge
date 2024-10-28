import insertManyStarships from '../src/services/starships/create';
import getStarshipsFromDB from '../src/services/starships/getFromDB';
import checkDuplicates from '../src/middlewares/starships/checkDuplicates';
import Starship from '../src/models/Starship';
import { StarshipData } from '../src/models/Starship';

const falcon = {
    "name": "Millennium Falcon",
    "model": "YT-1300 light freighter",
    "starship_class": "Light freighter",
    "manufacturer": "Corellian Engineering Corporation",
    "cost_in_credits": "100000",
    "length": "34.37",
    "crew": "4",
    "passengers": "6",
    "max_atmosphering_speed": "1050",
    "hyperdrive_rating": "0.5",
    "MGLT": "75",
    "cargo_capacity": "100000",
    "consumables": "2 months",
    "films": [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/2/",
        "https://swapi.dev/api/films/3/"
    ],
    "pilots": [
        "https://swapi.dev/api/people/13/",
        "https://swapi.dev/api/people/14/",
        "https://swapi.dev/api/people/25/",
        "https://swapi.dev/api/people/31/"
    ],
    "url": "https://swapi.dev/api/starships/10/",
    "__v": 0,
    "createdAt": new Date("2024-10-28T05:03:36.954Z"),
    "updatedAt": new Date("2024-10-28T05:03:36.954Z")
}

const deathStar = {
    "name": "Death Star",
    "model": "DS-1 Orbital Battle Station",
    "starship_class": "Deep Space Mobile Battlestation",
    "manufacturer": "Imperial Department of Military Research, Sienar Fleet Systems",
    "cost_in_credits": "1000000000000",
    "length": "120000",
    "crew": "342,953",
    "passengers": "843,342",
    "max_atmosphering_speed": "n/a",
    "hyperdrive_rating": "4.0",
    "MGLT": "10",
    "cargo_capacity": "1000000000000",
    "consumables": "3 years",
    "films": [
        "https://swapi.dev/api/films/1/"
    ],
    "pilots": [],
    "url": "https://swapi.dev/api/starships/9/",
    "__v": 0,
    "createdAt": new Date("2024-10-28T05:03:36.954Z"),
    "updatedAt": new Date("2024-10-28T05:03:36.954Z")
}

// Mocks de Mongoose
jest.mock('../src/models/Starship');

describe('Read & Save Service', () => {
    console.log('Starship:', Starship);
    it("Debe guardar las naves y devolver la cantidad guardada", async () => {
        const data: StarshipData[] = [falcon, deathStar];

        // Simula una inserción exitosa
        (Starship.insertMany as jest.Mock).mockResolvedValue(data);

        const result = await insertManyStarships(data);

        expect(result).toBe(2); // Debe retornar la cantidad de naves insertadas
        expect(Starship.insertMany).toHaveBeenCalledWith(data); // Verifica que se llame con los datos correctos
    });

    it("Debe manejar un error y devolver null", async () => {
        const data: StarshipData[] = [falcon, deathStar];

        // Simula un error en la inserción
        (Starship.insertMany as jest.Mock).mockRejectedValue(new Error("Database error"));

        const result = await insertManyStarships(data);

        expect(result).toBeNull(); // Debe retornar null en caso de error
        expect(Starship.insertMany).toHaveBeenCalledWith(data); // Verifica que se llame con los datos correctos
    });

    it('Debe filtrar datos duplicados y devolver solo los elementos únicos', async () => {
        // Datos de prueba con un duplicado
        const data: StarshipData[] = [falcon, deathStar, falcon];

        // Para que detecte el duplicado de falcon
        (Starship.exists as jest.Mock)
            .mockResolvedValueOnce(true)   // El primer falcon ya existe en la base de datos
            .mockResolvedValueOnce(false)  // deathStar no existe en la base de datos
            .mockResolvedValueOnce(true);  // El segundo falcon ya existe en la base de datos

        const result = await checkDuplicates(data);

        // Solo deathStar debería estar en el resultado, ya que es único
        expect(result).toEqual([deathStar]);
        expect(Starship.exists).toHaveBeenCalledTimes(3); // Llamado 3 veces, una por cada elemento
    });

    it("Debe retornar todos los documentos en la colección y el conteo total", async () => {
        const mockStarship = [falcon, deathStar];
        const paginationOptions = { filter: {}, pagination: { page: 1, limit: 10 }, skip: 0, sort: {} };

        // Simula el conteo total de documentos
        (Starship.countDocuments as jest.Mock).mockResolvedValue(mockStarship.length);
        // Simula la devolución de todos los documentos
        (Starship.find as jest.Mock).mockImplementation(() => ({
            sort: jest.fn().mockImplementation(() => ({
                skip: jest.fn().mockImplementation(() => ({
                    limit: jest.fn().mockResolvedValue(mockStarship.slice(paginationOptions.skip, paginationOptions.pagination.limit)),
                })),
            })),
        }));

        const result = await getStarshipsFromDB(paginationOptions);

        expect(result.success).toBe(true);
        expect(result.count).toBe(mockStarship.length);
        expect(result.results).toEqual(mockStarship);
        expect(result.status).toBe(200);
    });

    it("Debe retornar un arreglo vacío y count 0 si la colección está vacía", async () => {
        // Simula el conteo de 0 documentos y un arreglo vacío
        (Starship.countDocuments as jest.Mock).mockResolvedValue(0);
        (Starship.find as jest.Mock).mockResolvedValue([]);

        const options = { filter: {}, pagination: { page: 1, limit: 10 }, skip: 0, sort: {} };
        const result = await getStarshipsFromDB(options);

        expect(result.success).toBe(false);
        expect(result.count).toBe(0);
        expect(result.results).toEqual([]);
        expect(result.status).toBe(404);
    });
});
