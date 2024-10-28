import insertManyPeople from '../src/services/people/create';
import getPeopleFromDB from '../src/services/people/getFromDB';
import checkDuplicates from '../src/middlewares/people/checkDuplicates';
import People from '../src/models/People';
import { PeopleData } from '../src/models/People';

const luke = {
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    hair_color: "blond",
    skin_color: "fair",
    eye_color: "blue",
    birth_year: "19BBY",
    gender: "male",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/2/",
        "https://swapi.dev/api/films/3/",
        "https://swapi.dev/api/films/6/"
    ],
    species: [],
    vehicles: [
        "https://swapi.dev/api/vehicles/14/",
        "https://swapi.dev/api/vehicles/30/"
    ],
    starships: [
        "https://swapi.dev/api/starships/12/",
        "https://swapi.dev/api/starships/22/"
    ],
    createdAt: new Date("2014-12-09T13:50:51.644000Z"),
    editedAt: new Date("2014-12-20T21:17:56.891000Z"),
    url: "https://swapi.dev/api/people/1/"
};

const c3po = {
    name: "C-3PO",
    height: "167",
    mass: "75",
    hair_color: "n/a",
    skin_color: "gold",
    eye_color: "yellow",
    birth_year: "112BBY",
    gender: "n/a",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/2/",
        "https://swapi.dev/api/films/3/",
        "https://swapi.dev/api/films/4/",
        "https://swapi.dev/api/films/5/",
        "https://swapi.dev/api/films/6/"
    ],
    species: ["https://swapi.dev/api/species/2/"],
    vehicles: [],
    starships: [],
    createdAt: new Date("2014-12-10T15:10:51.357000Z"),
    editedAt: new Date("2014-12-20T21:17:50.309000Z"),
    url: "https://swapi.dev/api/people/2/"
};

// Mocks de Mongoose
jest.mock('../src/models/People');

describe('Read & Save Service', () => {
    it("Debe guardar las personas y devolver la cantidad guardada", async () => {
        const data: PeopleData[] = [luke, c3po];

        // Simula una inserción exitosa
        (People.insertMany as jest.Mock).mockResolvedValue(data);

        const result = await insertManyPeople(data);

        expect(result).toBe(2); // Debe retornar la cantidad de personas insertadas
        expect(People.insertMany).toHaveBeenCalledWith(data); // Verifica que se llame con los datos correctos
    });

    it("Debe manejar un error y devolver null", async () => {
        const data: PeopleData[] = [luke, c3po];

        // Simula un error en la inserción
        (People.insertMany as jest.Mock).mockRejectedValue(new Error("Database error"));

        const result = await insertManyPeople(data);

        expect(result).toBeNull(); // Debe retornar null en caso de error
        expect(People.insertMany).toHaveBeenCalledWith(data); // Verifica que se llame con los datos correctos
    });

    it('Debe filtrar datos duplicados y devolver solo los elementos únicos', async () => {
        // Datos de prueba con un duplicado
        const data: PeopleData[] = [luke, c3po, luke];

        // Para que detecte el duplicado de Luke
        (People.exists as jest.Mock)
            .mockResolvedValueOnce(true)   // El primer Luke ya existe en la base de datos
            .mockResolvedValueOnce(false)  // c3po no existe en la base de datos
            .mockResolvedValueOnce(true);  // El segundo Luke ya existe en la base de datos

        const result = await checkDuplicates(data);

        // Solo c3po debería estar en el resultado, ya que es único
        expect(result).toEqual([c3po]);
        expect(People.exists).toHaveBeenCalledTimes(3); // Llamado 3 veces, una por cada elemento
    });

    it("Debe retornar todos los documentos en la colección y el conteo total", async () => {
        const mockPeople = [luke, c3po];
        const paginationOptions = { filter: {}, pagination: { page: 1, limit: 10 }, skip: 0 };

        // Simula el conteo total de documentos
        (People.countDocuments as jest.Mock).mockResolvedValue(mockPeople.length);
        // Simula la devolución de todos los documentos
        (People.find as jest.Mock).mockImplementation(() => ({
            skip: jest.fn().mockImplementation(() => ({
                limit: jest.fn().mockResolvedValue(mockPeople.slice(paginationOptions.skip, paginationOptions.pagination.limit)),
            })),
        }));

        const result = await getPeopleFromDB(paginationOptions);

        expect(result.success).toBe(true);
        expect(result.count).toBe(mockPeople.length);
        expect(result.results).toEqual(mockPeople);
        expect(result.status).toBe(200);
    });

    it("Debe retornar un arreglo vacío y count 0 si la colección está vacía", async () => {
        // Simula el conteo de 0 documentos y un arreglo vacío
        (People.countDocuments as jest.Mock).mockResolvedValue(0);
        (People.find as jest.Mock).mockResolvedValue([]);

        const options = { filter: {}, pagination: { page: 1, limit: 10 }, skip: 0 };
        const result = await getPeopleFromDB(options);

        expect(result.success).toBe(false);
        expect(result.count).toBe(0);
        expect(result.results).toEqual([]);
        expect(result.status).toBe(404);
    });
});
