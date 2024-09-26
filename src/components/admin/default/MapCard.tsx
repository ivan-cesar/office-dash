import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import axios from 'axios';

interface Vehicle {
  id: number;
  location: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  driver: {
    first_name: string;
    contact_number: string;
  };
  course: {
    end_address: string;
    montant: number;
  };
}

const mapContainerStyle = { width: '100%', height: '500px' };
const centerLocation = { lat: 5.3907, lng: -4.0061 }; // Centrer sur Abidjan

function MapCard() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyClyDkHgDruEoaAPdnKjaQCY7LJog0_2Ss', // Remplace par ta clé API
    libraries: ['places'],
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [directions, setDirections] = useState<any>({});
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // Pour gérer l'info-bulle

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://appgobabi.com/api/rides/in-progress-today');
        const rides = response.data.in_progress_rides_today;
        const updatedVehicles: Vehicle[] = rides.map((ride: any, index: number) => ({
          id: index + 1,
          location: {
            lat: parseFloat(ride.driver.latitude),
            lng: parseFloat(ride.driver.longitude),
          },
          destination: {
            lat: parseFloat(ride.course_encours.end_latitude),
            lng: parseFloat(ride.course_encours.end_longitude),
          },
          driver: {
            first_name: ride.driver.first_name,
            contact_number: ride.driver.contact_number,
          },
          course: {
            end_address: ride.course_encours.end_address,
            montant: ride.course_encours.montant,
          },
        }));

        setVehicles(updatedVehicles);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const id = setInterval(fetchData, 1200000);
    setIntervalId(id);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  useEffect(() => {
    if (isLoaded && vehicles.length > 0) {
      vehicles.forEach((vehicle) => {
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
          {
            origin: vehicle.location,
            destination: vehicle.destination,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              setDirections((prevDirections) => ({
                ...prevDirections,
                [vehicle.id]: result,
              }));
            }
          }
        );
      });
    }
  }, [isLoaded, vehicles]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={centerLocation}
    >
      {vehicles.map((vehicle) => (
        <React.Fragment key={vehicle.id}>
          {/* Marqueur du véhicule en violet */}
          <Marker
            position={vehicle.location}
            icon="http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
            onClick={() => setSelectedVehicle(vehicle)} // Ouvrir info-bulle
          />

          {/* Marqueur de la destination en rouge */}
          <Marker
            position={vehicle.destination}
            label={`Dest ${vehicle.id}`}
            icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          />

          {directions[vehicle.id] && (
            <DirectionsRenderer directions={directions[vehicle.id]} />
          )}
        </React.Fragment>
      ))}

      {selectedVehicle && (
        <InfoWindow
          position={selectedVehicle.location}
          onCloseClick={() => setSelectedVehicle(null)} // Fermer info-bulle
        >
          <div>
            <h2>Chauffeur: {selectedVehicle.driver.first_name}</h2>
            <p>Contact: {selectedVehicle.driver.contact_number}</p>
            <h3>Course</h3>
            <p>Destination: {selectedVehicle.course.end_address}</p>
            <p>Montant: {selectedVehicle.course.montant} FCFA</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
}

export default MapCard;
