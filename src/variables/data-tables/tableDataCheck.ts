import axios from 'axios';

type RowObj = {
  nom: string;
  prenom: string;
  numero: string;
  email: string;
};

// Fonction pour récupérer les données et mettre à jour le tableau
const fetchDrivers = async (): Promise<RowObj[]> => {
  try {
    const response = await axios.get('https://appgobabi.com/api/count-old-version-drivers');
    const drivers = response.data.drivers_on_old_version;

    // Formatage des données pour correspondre à RowObj
    const tableDataCheck = drivers.map((driver: any) => ({
      nom: driver.last_name,
      prenom: driver.first_name,
      numero: driver.contact_number,
      email: driver.email,
    }));

    return tableDataCheck; // Retourner les données mises à jour
  } catch (error) {
    console.error('Erreur lors de la récupération des chauffeurs :', error);
    return []; // Retourner un tableau vide en cas d'erreur
  }
};

// Fonction pour utiliser les données
let tableDataCheck: RowObj[] = [];

const loadDrivers = async () => {
  tableDataCheck = await fetchDrivers();
  console.log(' recu : ',tableDataCheck); // Affiche les données après récupération
};

// Appel de la fonction pour charger les chauffeurs
loadDrivers();

export default tableDataCheck;
