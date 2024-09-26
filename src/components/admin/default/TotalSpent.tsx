import {
  MdArrowDropUp,
  MdOutlineCalendarToday,
  MdBarChart,
  MdDashboard
} from "react-icons/md";
import { IoMdHome } from 'react-icons/io';

import Card from "components/card";
import {
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from "variables/charts";
import LineChart from "components/charts/LineChart";
import { IoDocuments } from 'react-icons/io5';
import OtherWidget from "components/widget/OtherWidgets";
import { BsCartCheckFill } from "react-icons/bs";
import { BsCartXFill } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";





const TotalSpent = () => {

  const [riderInProgress, setRiderInProgress] = useState<number>(0);
  const [newRideRequest, setNewRideRequest] = useState<number>(0);
  const [completedRide, setCompletedRide] = useState<number>(0);
  const [totalRides, setTotalRides] = useState<number>(0);
  const [canceledRide, setCanceledRides] = useState<number>(0);
  const [canceledToday, setCanceledToday] = useState<number>(0);
  const [reservationToday, setReservationToday] = useState<number>(0);
  const [reservationRide, setReservationRide] = useState<number>(0);






  const previousRiderInProgress = useRef<number>(riderInProgress);
  const previousnewRideRequest = useRef<number>(newRideRequest); 

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR'; // Définit la langue en français
    synth.speak(utterance);
  };
    // Fonction pour charger les données des API
    const fetchData = async () => {
      try {
      
        const riderInProgressResponse = await fetch("https://appgobabi.com/api/count-in-progress-ride");
        const newRideRequestResponse = await fetch("https://appgobabi.com/api/rides/new-ride-requested-today");
        const completedRideResponse = await fetch("https://appgobabi.com/api/rides/completed-today");
        const totalRidesResponse = await fetch("https://appgobabi.com/api/count-rides");
        const canceledRidesResponse = await fetch("https://appgobabi.com/api/count-canceled-ride");
        const canceledToDayResponse = await fetch("https://appgobabi.com/api/rides/canceled-today");
        const resevationRideResponse = await fetch("https://appgobabi.com/api/reservations/total");
        const resevationToDayResponse = await fetch("https://appgobabi.com/api/reservations/today");



        const riderInProgressData = await riderInProgressResponse.json();
        const newRideRequestData = await newRideRequestResponse.json();
        const completedRideData = await completedRideResponse.json();
        const totalRidesData = await totalRidesResponse.json();
        const canceledRideData = await canceledRidesResponse.json();
        const canceledToDayData = await canceledToDayResponse.json();
        const resevationRideData = await resevationRideResponse.json();
        const resevationToDayData = await resevationToDayResponse.json();

         

        setRiderInProgress(riderInProgressData.in_progress_rides_count)
        setNewRideRequest(newRideRequestData.new_ride_requested_today_count)
        setCompletedRide(completedRideData.completed_rides_today_count)
        setTotalRides(totalRidesData.total_rides)
        setCanceledRides(canceledRideData.canceled_rides_count)
        setCanceledToday(canceledToDayData.canceled_rides_today_count)
        setReservationToday(resevationToDayData.today_reservations)
        setReservationRide(resevationRideData.total_reservations)
      } catch (error) {
        console.error("Erreur lors du chargement des données : ", error);
      }
    };
  
    // Charger les données une fois que le composant est monté
    useEffect(() => {
      fetchData();
      // Mettre à jour les données sans détruire le composant entier toutes les 30 secondes
      const interval = setInterval(() => {
        fetchData();
      }, 30000);
  
      return () => clearInterval(interval); // Nettoyer l'intervalle à la destruction du composant
    }, []);

      // Détecter les changements de riderInProgress et émettre un son vocal
  useEffect(() => {
    if (riderInProgress !== previousRiderInProgress.current) {
      speak("Une nouvelle course est en cours");
      previousRiderInProgress.current = riderInProgress; // Mettre à jour la valeur précédente
    }
    if (newRideRequest !== previousnewRideRequest.current) {
      speak("Une nouvelle course viens d'être demandé");
      previousnewRideRequest.current = newRideRequest; // Mettre à jour la valeur précédente
    }
  }, [riderInProgress,newRideRequest]);

  return (
    <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6">
    <OtherWidget
      icon={<BsCartCheckFill className="h-7 w-7" />}
      title={'Commande En Cours'}
      subtitle={`${riderInProgress}`}
      color={'text-[#22c55e]'}
      />
    <OtherWidget
      icon={<IoDocuments className="h-6 w-6" />}
      title={'Nouvelle Demande De Course'}
      subtitle={`${newRideRequest}`}
      color={'text-[#22c55e]'}

    />
     <OtherWidget
      icon={<IoMdHome className="h-6 w-6" />}
      title={"Course Effectué Aujourd'hui"}
      subtitle={`${completedRide}`}
      color={'text-[#22c55e]'}

    />
     <OtherWidget
      icon={<BsCartXFill className="h-7 w-7" />}
      title={"Course Annuler Aujourd'ui"}
      subtitle={`${canceledToday}`}
      color={'text-[#b91c1c]'}

    />
    <OtherWidget
      icon={<MdBarChart className="h-7 w-7" />}
      title={"Réservation du jour"}
      subtitle={`${reservationToday}`}
      color={'text-[#22c55e]'}

    />
    <OtherWidget
      icon={<MdDashboard className="h-6 w-6" />}
      title={"Totale résevartion"}
      subtitle={`${reservationRide}`}
      color={'text-[#22c55e]'}

    />
    <OtherWidget
      icon={<BsCartXFill className="h-7 w-7" />}
      title={'Course Annuler'}
      subtitle={`${canceledRide}`}
      color={'text-[#b91c1c]'}

    />
    <OtherWidget
      icon={<IoMdHome className="h-6 w-6" />}
      title={'Commande Totale'}
      subtitle={`${totalRides}`}
      color={'text-[#22c55e]'}

    />
    {/* <OtherWidget
      icon={<IoMdHome className="h-6 w-6" />}
      title={"Chauffeur ayant Reçu Une Course"}
      subtitle={'$2433'}
      color={'text-[#22c55e]'}

    /> */}
  </div>
  );
};

export default TotalSpent;
