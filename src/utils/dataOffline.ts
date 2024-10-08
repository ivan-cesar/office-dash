import axios from 'axios';

export type RowObj = {
  nom: string;
  prenom: string;
  numero: string;
  email: string;
};

// Type pour les données paginées
export type PaginatedDrivers = {
  data: RowObj[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

// Fonction pour récupérer les données avec pagination
export const fetchDrivers = async (current_page: number = 1, per_page: number = 10): Promise<PaginatedDrivers> => {
  try {
    // const response = await axios.get(`appgobabi.com/api/count-offline-drivers?page=${current_page}&per_page=${per_page}`);
    const response = await axios.get(`https://appgobabi.com/api/count-offline-drivers`);
    const drivers = response.data.offline_drivers;
    const pagination = response.data.pagination;

    // Formatage des données pour correspondre à RowObj
    const tableDataCheck = drivers.map((driver: any) => ({
      nom: driver.last_name,
      prenom: driver.first_name,
      numero: driver.contact_number,
      email: driver.email,
    }));

    return {
      data: tableDataCheck,  // Retourner les données mises à jour
      pagination: {
        current_page: pagination.current_page,
        last_page: pagination.last_page,
        per_page: pagination.per_page,
        total: pagination.total,
      }, // Retourner les informations de pagination
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des chauffeurs :', error);
    return {
      data: [], // Retourner un tableau vide si erreur
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: per_page,
        total: 0,
      }, // Retourner une pagination par défaut si erreur
    };
  }
};
