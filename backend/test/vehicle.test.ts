import insertManyVehicles from '../src/services/vehicles/create';
import getVehiclesFromDB from '../src/services/vehicles/getFromDB';
import checkDuplicates from '../src/middlewares/vehicles/checkDuplicates';
import Vehicle from '../src/models/Vehicle';
import { VehicleData } from '../src/models/Vehicle';

const t16 = {
    "name": "T-16 skyhopper",
    "model": "T-16 skyhopper",
    "vehicle_class": "repulsorcraft",
    "manufacturer": "Incom Corporation",
    "length": "10.4 ",
    "cost_in_credits": "14500",
    "crew": "1",
    "passengers": "1",
    "max_atmosphering_speed": "1200",
    "cargo_capacity": "50",
    "consumables": "0",
    "films": [
        "https://swapi.dev/api/films/1/"
    ],
    "pilots": [],
    "url": "https://swapi.dev/api/vehicles/6/",
    "__v": 0,
    "createdAt": new Date("2024-10-28T05:03:33.760Z"),
    "updatedAt": new Date("2024-10-28T05:03:33.760Z")
}

const x34 = {
    "name": "X-34 landspeeder",
    "model": "X-34 landspeeder",
    "vehicle_class": "repulsorcraft",
    "manufacturer": "SoroSuub Corporation",
    "length": "3.4 ",
    "cost_in_credits": "10550",
    "crew": "1",
    "passengers": "1",
    "max_atmosphering_speed": "250",
    "cargo_capacity": "5",
    "consumables": "unknown",
    "films": [
        "https://swapi.dev/api/films/1/"
    ],
    "pilots": [],
    "url": "https://swapi.dev/api/vehicles/7/",
    "__v": 0,
    "createdAt": new Date("2024-10-28T05:03:33.760Z"),
    "updatedAt": new Date("2024-10-28T05:03:33.760Z")
}

// Mocks de Mongoose
jest.mock('../src/models/Vehicle');

describe('Read & Save Service', () => {
    it("Debe guardar las vehiculos y devolver la cantidad guardada", async () => {
        const data: VehicleData[] = [t16, x34];

        // Simula una inserción exitosa
        (Vehicle.insertMany as jest.Mock).mockResolvedValue(data);

        const result = await insertManyVehicles(data);

        expect(result).toBe(2); // Debe retornar la cantidad de vehiculos insertadas
        expect(Vehicle.insertMany).toHaveBeenCalledWith(data); // Verifica que se llame con los datos correctos
    });

    it("Debe manejar un error y devolver null", async () => {
        const data: VehicleData[] = [t16, x34];

        // Simula un error en la inserción
        (Vehicle.insertMany as jest.Mock).mockRejectedValue(new Error("Database error"));

        const result = await insertManyVehicles(data);

        expect(result).toBeNull(); // Debe retornar null en caso de error
        expect(Vehicle.insertMany).toHaveBeenCalledWith(data); // Verifica que se llame con los datos correctos
    });

    it('Debe filtrar datos duplicados y devolver solo los elementos únicos', async () => {
        // Datos de prueba con un duplicado
        const data: VehicleData[] = [t16, x34, t16];

        // Para que detecte el duplicado de t16
        (Vehicle.exists as jest.Mock)
            .mockResolvedValueOnce(true)   // El primer t16 ya existe en la base de datos
            .mockResolvedValueOnce(false)  // x34 no existe en la base de datos
            .mockResolvedValueOnce(true);  // El segundo t16 ya existe en la base de datos

        const result = await checkDuplicates(data);

        // Solo x34 debería estar en el resultado, ya que es único
        expect(result).toEqual([x34]);
        expect(Vehicle.exists).toHaveBeenCalledTimes(3); // Llamado 3 veces, una por cada elemento
    });

    it("Debe retornar todos los documentos en la colección y el conteo total", async () => {
        const mockVehicle = [t16, x34];
        const paginationOptions = { filter: {}, pagination: { page: 1, limit: 10 }, skip: 0, sort: {} };

        // Simula el conteo total de documentos
        (Vehicle.countDocuments as jest.Mock).mockResolvedValue(mockVehicle.length);
        // Simula la devolución de todos los documentos
        (Vehicle.find as jest.Mock).mockImplementation(() => ({
            sort: jest.fn().mockImplementation(() => ({
                skip: jest.fn().mockImplementation(() => ({
                    limit: jest.fn().mockResolvedValue(mockVehicle.slice(paginationOptions.skip, paginationOptions.pagination.limit)),
                })),
            })),
        }));

        const result = await getVehiclesFromDB(paginationOptions);

        expect(result.success).toBe(true);
        expect(result.count).toBe(mockVehicle.length);
        expect(result.results).toEqual(mockVehicle);
        expect(result.status).toBe(200);
    });

    it("Debe retornar un arreglo vacío y count 0 si la colección está vacía", async () => {
        // Simula el conteo de 0 documentos y un arreglo vacío
        (Vehicle.countDocuments as jest.Mock).mockResolvedValue(0);
        (Vehicle.find as jest.Mock).mockResolvedValue([]);

        const options = { filter: {}, pagination: { page: 1, limit: 10 }, skip: 0, sort: {} };
        const result = await getVehiclesFromDB(options);

        expect(result.success).toBe(false);
        expect(result.count).toBe(0);
        expect(result.results).toEqual([]);
        expect(result.status).toBe(404);
    });
});
