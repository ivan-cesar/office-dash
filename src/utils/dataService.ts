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
export const fetchDrivers = async (page: number = 3, perPage: number = 10): Promise<PaginatedDrivers> => {
  try {
    const response = await axios.get(`https://appgobabi.com/api/count-offline-drivers`);
    const riders = response.data.offline_drivers; // Les données des riders annulés

    console.log("ride ", riders);

    // Vérifier si pagination existe dans la réponse
    const pagination = response.data.pagination || {
      current_page: 1,
      last_page: 1,
      per_page: perPage,
      total: 0,
    };

    // Formatage des données pour correspondre à RowObj
    const tableDataCheck = riders.map((riderData: any) => ({
      nom: riderData.last_name,
      prenom: riderData.first_name,
      numero: riderData.contact_number,
      email: riderData.email,
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
        per_page: perPage,
        total: 0,
      }, // Retourner une pagination par défaut si erreur
    };
  }
};
