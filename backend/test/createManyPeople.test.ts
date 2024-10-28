import insertManyPeople from '../src/services/people/create';
import getPeopleFromDB from '../src/services/people/getFromDB';
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
    created: "2014-12-09T13:50:51.644000Z",
    edited: "2014-12-20T21:17:56.891000Z",
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
    created: "2014-12-10T15:10:51.357000Z",
    edited: "2014-12-20T21:17:50.309000Z",
    url: "https://swapi.dev/api/people/2/"
};

// Mocks de Mongoose
jest.mock('../src/models/People', () => {
    const mockPeople = {
        countDocuments: jest.fn(),
        find: jest.fn().mockReturnThis(), // Permite encadenar métodos
    };

    // Mock de skip y limit
    mockPeople.find.mockImplementation(() => {
        return {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([luke, c3po]), // Retorna los datos simulados
        };
    });

    return mockPeople;
});

describe('Read & Save Service', () => {
    it('Debe guardar las personas y devolver la cantidad guardada', async () => {
        const data: PeopleData[] = [luke, c3po];
        const count = 2;

        (People.insertMany as jest.Mock).mockResolvedValue(data);
        const result = await insertManyPeople(data);

        expect(result).toBe(count);
        expect(People.insertMany).toHaveBeenCalledWith(data);
    });

    it('Debe retornar un array de personas encontradas', async () => {
        const expectedData = {
            success: true,
            count: 2,
            next: null,
            previous: null,
            results: [luke, c3po],
            status: 200
        };

        (People.countDocuments as jest.Mock).mockResolvedValue(2);
        
        const options = {
            filter: {},
            pagination: { page: 1, limit: 10 },
            skip: 0
        };
        
        const result = await getPeopleFromDB(options);
        expect(result).toEqual(expectedData);
        expect(People.countDocuments).toHaveBeenCalledWith(options.filter);
    });
});
