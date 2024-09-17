import React, { useEffect, useRef, useState } from "react";
import Card from "components/card";
import mapboxgl from "mapbox-gl";

// Clé d'API Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiYmVhdWNvZGUiLCJhIjoiY20wbW5pZ3B5MDVnZDJrc2pyMHUzZjU4biJ9.yPHypDgZ3JjFhARt2KWhUQ';

function MapCard() {
  const mapContainerRef = useRef(null);
  const [inProgressRides, setInProgressRides] = useState([]);

  // Appeler l'API pour obtenir les courses en cours
  const fetchInProgressRides = async () => {
    try {
      const response = await fetch('http://appgobabi.com/api/count-in-progress-ride');
      const data = await response.json();
      console.log("Rides in progress:", data.in_progress_rides); // Log pour vérifier les données
      setInProgressRides(data.in_progress_rides);
    } catch (error) {
      console.error("Erreur lors de la récupération des courses en cours:", error);
    }
  };

  useEffect(() => {
    fetchInProgressRides(); // Appel initial pour récupérer les données
  }, []);

  useEffect(() => {
    // Initialisation de la carte
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v11", // Style de la carte
      center: [-4.008256, 5.336414], // Coordonnées initiales [longitude, latitude]
      zoom: 10, // Zoom initial
    });

    // Ajout de contrôles de zoom et de rotation
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Ajouter des marqueurs pour chaque course en cours
    if (inProgressRides.length > 0) {
      inProgressRides.forEach((ride) => {
        const longitude = parseFloat(ride.start_longitude);
        const latitude = parseFloat(ride.start_latitude);

        if (!isNaN(longitude) && !isNaN(latitude)) {
          new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h3>${ride.driver.display_name}</h3><p>Départ: ${ride.start_address}</p>`)
            )
            .addTo(map);
        } else {
          console.error("Invalid coordinates for ride", ride.id);
        }
      });
    }

    return () => {
      // Nettoyage lors de la désactivation du composant
      map.remove();
    };
  }, [inProgressRides]); // Re-render si les courses changent

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      {/* Conteneur pour la carte Mapbox */}
      <div
        ref={mapContainerRef}
        style={{ height: "500px", width: "100%", marginTop: "20px", marginBottom: "20px" }}
      />
    </Card>
  );
}

export default MapCard;
