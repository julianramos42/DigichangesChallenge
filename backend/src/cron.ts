import axios from 'axios';
import cron from 'node-cron';

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
          createPeople(dataList[i][1]);
          break;
        case 'planets':
          createPlanets(dataList[i][1]);
          break;
        case 'starships':
          createStarships(dataList[i][1]);
          break;
        case 'films':
          createFilms(dataList[i][1]);
          break;
        case 'species':
          createSpecies(dataList[i][1]);
          break;
        case 'vehicles':
          createVehicles(dataList[i][1]);
          break;
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

function createPeople(url: string): void {
  console.log(url);
}
function createPlanets(url: string): void {
  console.log(url);
}
function createStarships(url: string): void {
  console.log(url);
}
function createFilms(url: string): void {
  console.log(url);
}
function createSpecies(url: string): void {
  console.log(url);
}
function createVehicles(url: string): void {
  console.log(url);
}

// Cron programado a las 00hs
const cronJob = cron.schedule('0 0 * * *', () => {
  console.log('Running Cron Job');
  fetchDataAndSaveToDB();
}, {
  scheduled: false // El cron no se inicia automáticamente
});

fetchDataAndSaveToDB()
export default cronJob;