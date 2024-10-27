import axios from 'axios';
import cron from 'node-cron';
// Controladores
import createManyPeople from './controllers/people/createMany';
import createManyPlanets from './controllers/planets/createMany'
import createManyFilms from './controllers/films/createMany';
import createManySpecies from './controllers/species/createMany';
import createManyStarships from './controllers/starships/createMany';
import createManyVehicles from './controllers/vehicles/createMany';

type DataListType = [string, string]

// Función para obtener datos de la API
async function fetchDataAndSaveToDB(): Promise<void> {
  try {
    const response = await axios.get('https://swapi.dev/api');
    // El objeto que nos retorna, lo transformamos a un array para poder iterarlo
    const dataList: DataListType[] = Object.entries(response.data) as DataListType[];
    for (let i = 0; i < dataList.length; i++) {
      // Revisamos la categoria (people, films, etc) y llamamos a la función que corresponda
      // Hice un switch por si en algun momento se agrega otra categoria mas, no rompa el codigo
      switch (dataList[i][0]) {
        case 'people':
          await createManyPeople(dataList[i][1]);
          break;
        case 'planets':
          await createManyPlanets(dataList[i][1]);
          break;
        case 'starships':
          await createManyStarships(dataList[i][1]);
          break;
        case 'films':
          await createManyFilms(dataList[i][1]);
          break;
        case 'species':
          await createManySpecies(dataList[i][1]);
          break;
        case 'vehicles':
          await createManyVehicles(dataList[i][1]);
          break;
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally{
    console.log("Proceso 'FetchDataAndSaveToDB' terminado.");
  }
};

// Cron programado a las 00hs
const cronJob = cron.schedule('0 0 * * *', () => {
  console.log('Running Cron Job');
  fetchDataAndSaveToDB();
}, {
  scheduled: false // El cron no se inicia automáticamente
});
fetchDataAndSaveToDB();
export default cronJob;