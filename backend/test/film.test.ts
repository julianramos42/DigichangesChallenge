import insertManyFilms from '../src/services/films/create';
import getFilmsFromDB from '../src/services/films/getFromDB';
import checkDuplicates from '../src/middlewares/films/checkDuplicates';
import Film from '../src/models/Film';
import { FilmData } from '../src/models/Film';

const newHope = {
    "title": "A New Hope",
    "episode_id": 4,
    "opening_crawl": "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
    "director": "George Lucas",
    "producer": "Gary Kurtz, Rick McCallum",
    "release_date": new Date("1977-05-25T00:00:00.000Z"),
    "species": [
        "https://swapi.dev/api/species/1/",
        "https://swapi.dev/api/species/2/",
        "https://swapi.dev/api/species/3/",
        "https://swapi.dev/api/species/4/",
        "https://swapi.dev/api/species/5/"
    ],
    "starships": [
        "https://swapi.dev/api/starships/2/",
        "https://swapi.dev/api/starships/3/",
        "https://swapi.dev/api/starships/5/",
        "https://swapi.dev/api/starships/9/",
        "https://swapi.dev/api/starships/10/",
        "https://swapi.dev/api/starships/11/",
        "https://swapi.dev/api/starships/12/",
        "https://swapi.dev/api/starships/13/"
    ],
    "vehicles": [
        "https://swapi.dev/api/vehicles/4/",
        "https://swapi.dev/api/vehicles/6/",
        "https://swapi.dev/api/vehicles/7/",
        "https://swapi.dev/api/vehicles/8/"
    ],
    "characters": [
        "https://swapi.dev/api/people/1/",
        "https://swapi.dev/api/people/2/",
        "https://swapi.dev/api/people/3/",
        "https://swapi.dev/api/people/4/",
        "https://swapi.dev/api/people/5/",
        "https://swapi.dev/api/people/6/",
        "https://swapi.dev/api/people/7/",
        "https://swapi.dev/api/people/8/",
        "https://swapi.dev/api/people/9/",
        "https://swapi.dev/api/people/10/",
        "https://swapi.dev/api/people/12/",
        "https://swapi.dev/api/people/13/",
        "https://swapi.dev/api/people/14/",
        "https://swapi.dev/api/people/15/",
        "https://swapi.dev/api/people/16/",
        "https://swapi.dev/api/people/18/",
        "https://swapi.dev/api/people/19/",
        "https://swapi.dev/api/people/81/"
    ],
    "planets": [
        "https://swapi.dev/api/planets/1/",
        "https://swapi.dev/api/planets/2/",
        "https://swapi.dev/api/planets/3/"
    ],
    "url": "https://swapi.dev/api/films/1/",
    "__v": 0,
    "createdAt": new Date("2024-10-28T05:03:29.721Z"),
    "updatedAt": new Date("2024-10-28T05:03:29.721Z")
}

const returnJedi = {
    "title": "Return of the Jedi",
    "episode_id": 6,
    "opening_crawl": "Luke Skywalker has returned to\r\nhis home planet of Tatooine in\r\nan attempt to rescue his\r\nfriend Han Solo from the\r\nclutches of the vile gangster\r\nJabba the Hutt.\r\n\r\nLittle does Luke know that the\r\nGALACTIC EMPIRE has secretly\r\nbegun construction on a new\r\narmored space station even\r\nmore powerful than the first\r\ndreaded Death Star.\r\n\r\nWhen completed, this ultimate\r\nweapon will spell certain doom\r\nfor the small band of rebels\r\nstruggling to restore freedom\r\nto the galaxy...",
    "director": "Richard Marquand",
    "producer": "Howard G. Kazanjian, George Lucas, Rick McCallum",
    "release_date": new Date("1983-05-25T00:00:00.000Z"),
    "species": [
        "https://swapi.dev/api/species/1/",
        "https://swapi.dev/api/species/2/",
        "https://swapi.dev/api/species/3/",
        "https://swapi.dev/api/species/5/",
        "https://swapi.dev/api/species/6/",
        "https://swapi.dev/api/species/8/",
        "https://swapi.dev/api/species/9/",
        "https://swapi.dev/api/species/10/",
        "https://swapi.dev/api/species/15/"
    ],
    "starships": [
        "https://swapi.dev/api/starships/2/",
        "https://swapi.dev/api/starships/3/",
        "https://swapi.dev/api/starships/10/",
        "https://swapi.dev/api/starships/11/",
        "https://swapi.dev/api/starships/12/",
        "https://swapi.dev/api/starships/15/",
        "https://swapi.dev/api/starships/17/",
        "https://swapi.dev/api/starships/22/",
        "https://swapi.dev/api/starships/23/",
        "https://swapi.dev/api/starships/27/",
        "https://swapi.dev/api/starships/28/",
        "https://swapi.dev/api/starships/29/"
    ],
    "vehicles": [
        "https://swapi.dev/api/vehicles/8/",
        "https://swapi.dev/api/vehicles/16/",
        "https://swapi.dev/api/vehicles/18/",
        "https://swapi.dev/api/vehicles/19/",
        "https://swapi.dev/api/vehicles/24/",
        "https://swapi.dev/api/vehicles/25/",
        "https://swapi.dev/api/vehicles/26/",
        "https://swapi.dev/api/vehicles/30/"
    ],
    "characters": [
        "https://swapi.dev/api/people/1/",
        "https://swapi.dev/api/people/2/",
        "https://swapi.dev/api/people/3/",
        "https://swapi.dev/api/people/4/",
        "https://swapi.dev/api/people/5/",
        "https://swapi.dev/api/people/10/",
        "https://swapi.dev/api/people/13/",
        "https://swapi.dev/api/people/14/",
        "https://swapi.dev/api/people/16/",
        "https://swapi.dev/api/people/18/",
        "https://swapi.dev/api/people/20/",
        "https://swapi.dev/api/people/21/",
        "https://swapi.dev/api/people/22/",
        "https://swapi.dev/api/people/25/",
        "https://swapi.dev/api/people/27/",
        "https://swapi.dev/api/people/28/",
        "https://swapi.dev/api/people/29/",
        "https://swapi.dev/api/people/30/",
        "https://swapi.dev/api/people/31/",
        "https://swapi.dev/api/people/45/"
    ],
    "planets": [
        "https://swapi.dev/api/planets/1/",
        "https://swapi.dev/api/planets/5/",
        "https://swapi.dev/api/planets/7/",
        "https://swapi.dev/api/planets/8/",
        "https://swapi.dev/api/planets/9/"
    ],
    "url": "https://swapi.dev/api/films/3/",
    "__v": 0,
    "createdAt": new Date("2024-10-28T05:03:29.722Z"),
    "updatedAt": new Date("2024-10-28T05:03:29.722Z")
}

// Mocks de Mongoose
jest.mock('../src/models/Film');

describe('Read & Save Service', () => {
    it("Debe guardar las peliculas y devolver la cantidad guardada", async () => {
        const data: FilmData[] = [newHope, returnJedi];

        // Simula una inserción exitosa
        (Film.insertMany as jest.Mock).mockResolvedValue(data);

        const result = await insertManyFilms(data);

        expect(result).toBe(2); // Debe retornar la cantidad de peliculas insertadas
        expect(Film.insertMany).toHaveBeenCalledWith(data); // Verifica que se llame con los datos correctos
    });

    it("Debe manejar un error y devolver null", async () => {
        const data: FilmData[] = [newHope, returnJedi];

        // Simula un error en la inserción
        (Film.insertMany as jest.Mock).mockRejectedValue(new Error("Database error"));

        const result = await insertManyFilms(data);

        expect(result).toBeNull(); // Debe retornar null en caso de error
        expect(Film.insertMany).toHaveBeenCalledWith(data); // Verifica que se llame con los datos correctos
    });

    it('Debe filtrar datos duplicados y devolver solo los elementos únicos', async () => {
        // Datos de prueba con un duplicado
        const data: FilmData[] = [newHope, returnJedi, newHope];

        // Para que detecte el duplicado de newHope
        (Film.exists as jest.Mock)
            .mockResolvedValueOnce(true)   // El primer newHope ya existe en la base de datos
            .mockResolvedValueOnce(false)  // returnJedi no existe en la base de datos
            .mockResolvedValueOnce(true);  // El segundo newHope ya existe en la base de datos

        const result = await checkDuplicates(data);

        // Solo returnJedi debería estar en el resultado, ya que es único
        expect(result).toEqual([returnJedi]);
        expect(Film.exists).toHaveBeenCalledTimes(3); // Llamado 3 veces, una por cada elemento
    });

    it("Debe retornar todos los documentos en la colección y el conteo total", async () => {
        const mockFilm = [newHope, returnJedi];
        const paginationOptions = { filter: {}, pagination: { page: 1, limit: 10 }, skip: 0 };

        // Simula el conteo total de documentos
        (Film.countDocuments as jest.Mock).mockResolvedValue(mockFilm.length);
        // Simula la devolución de todos los documentos
        (Film.find as jest.Mock).mockImplementation(() => ({
            skip: jest.fn().mockImplementation(() => ({
                limit: jest.fn().mockResolvedValue(mockFilm.slice(paginationOptions.skip, paginationOptions.pagination.limit)),
            })),
        }));

        const result = await getFilmsFromDB(paginationOptions);

        expect(result.success).toBe(true);
        expect(result.count).toBe(mockFilm.length);
        expect(result.results).toEqual(mockFilm);
        expect(result.status).toBe(200);
    });

    it("Debe retornar un arreglo vacío y count 0 si la colección está vacía", async () => {
        // Simula el conteo de 0 documentos y un arreglo vacío
        (Film.countDocuments as jest.Mock).mockResolvedValue(0);
        (Film.find as jest.Mock).mockResolvedValue([]);

        const options = { filter: {}, pagination: { page: 1, limit: 10 }, skip: 0 };
        const result = await getFilmsFromDB(options);

        expect(result.success).toBe(false);
        expect(result.count).toBe(0);
        expect(result.results).toEqual([]);
        expect(result.status).toBe(404);
    });
});
