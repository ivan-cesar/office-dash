'use client';
import MiniCalendar from 'components/calendar/MiniCalendar';
import WeeklyRevenue from 'components/admin/default/WeeklyRevenue';
import TotalSpent from 'components/admin/default/TotalSpent';
import PieChartCard from 'components/admin/default/PieChartCard';
import { IoMdHome } from 'react-icons/io';
import { IoDocuments } from 'react-icons/io5';
import { MdBarChart, MdDashboard } from 'react-icons/md';
import { FaTaxi } from "react-icons/fa6";
import { RiTaxiWifiFill } from "react-icons/ri";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import { MdTaxiAlert } from "react-icons/md";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { MdPhonelinkErase } from "react-icons/md";
import { FaCarBurst } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";

import Widget from 'components/widget/Widget';
import CheckTable from 'components/admin/default/CheckTable';
import ComplexTable from 'components/admin/default/ComplexTable';
import DailyTraffic from 'components/admin/default/DailyTraffic';
import TaskCard from 'components/admin/default/TaskCard';
import tableDataCheck from 'variables/data-tables/tableDataCheck';
import tableDataComplex from 'variables/data-tables/tableDataComplex';
import MapCard from 'components/admin/default/MapCard';
import CheckTableOther from 'components/admin/default/CheckTableOther';
import Link from 'next/link';

const Dashboard = () => {
  const [totalRiders, setTotalRiders] = useState<number>(0);
  const [totalDrivers, setTotalDrivers] = useState<number>(0);
  const [onlinDriversCount, setOnlineDriversCount] = useState<number>(0);
  const [offlineDriversCount, setOfflineDriversCount] = useState<number>(0);
  const [driversByIdCode, setDriversByIdCode] = useState<number>(0);
  const [oldVersion, setOldVersion] = useState<number>(0);
  const [riderInProgress, setRiderInProgress] = useState<number>(0);

  const previousRiderInProgress = useRef<number>(riderInProgress); // Garde la valeur précédente de riderInProgress

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR'; // Définit la langue en français
    synth.speak(utterance);
  };
    // Fonction pour charger les données des API
    const fetchData = async () => {
      try {
        const ridersResponse = await fetch("http://appgobabi.com/api/count-riders");
        const driversResponse = await fetch("http://appgobabi.com/api/count-drivers");
        const driversOnlinesResponse = await fetch("http://appgobabi.com/api/count-online-drivers");
        const driversOfflinesResponse = await fetch("http://appgobabi.com/api/count-offline-drivers");
        const driversByIdCodeResponse = await fetch("http://appgobabi.com/api/drivers-by-id-code");
        const oldVersionResponse = await fetch("http://appgobabi.com/api/count-old-version-drivers");
        const riderInProgressResponse = await fetch("http://appgobabi.com/api/rides/in-progress-today");


        const ridersData = await ridersResponse.json();
        const driversData = await driversResponse.json();
        const driversOnlinesData = await driversOnlinesResponse.json();
        const driversOfflinesData = await driversOfflinesResponse.json();
        const driversByIdCodeData = await driversByIdCodeResponse.json();
        const oldVersionData = await oldVersionResponse.json();
        const riderInProgressData = await riderInProgressResponse.json();
         
        setTotalRiders(ridersData.total_riders);
        setTotalDrivers(driversData.total_drivers);
        setOnlineDriversCount(driversOnlinesData.online_drivers_count)
        setOfflineDriversCount(driversOfflinesData.offline_drivers_count)
        setDriversByIdCode(driversByIdCodeData.drivers_with_non_null_id_code.count)
        setOldVersion(oldVersionData.drivers_on_old_version_count)
        setRiderInProgress(riderInProgressData.in_progress_rides_today_count)
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
  }, [riderInProgress]);

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6">
        <Widget
          icon={<FaTaxi className="h-7 w-7" />}
          title={'Conducteur Total'}
          subtitle={`${totalDrivers}`}
          color={'text-[#22c55e]'}
        />
        <Link href={'/'} >
        <Widget
          icon={<RiTaxiWifiFill className="h-6 w-6" />}
          title={"Conducteur En Ligne Aujourd'hui"}
          subtitle={`${onlinDriversCount}`}
          color={'text-brand-500'}

        />
        </Link>
        <Widget
          icon={<MdTaxiAlert className="h-7 w-7" />}
          title={'Conducteur Hors Ligne'}
          subtitle={`${offlineDriversCount}`}
          color={'text-[#b91c1c]'}

        />
            <Widget
          icon={<FaCarBurst className="h-6 w-6" />}
          title={'Conducteur Effectuant une course'}
          subtitle={`${riderInProgress}`}
          color={'text-[#22c55e]'}

        />
        <Widget
          icon={<MdOutlinePhoneIphone className="h-6 w-6" />}
          title={'Conducteur Avec New App'}
          subtitle={`${totalDrivers - oldVersion}`}
          color={'text-[#22c55e]'}

        />
        <Widget
          icon={<MdPhonelinkErase className="h-7 w-7" />}
          title={'Conducteur Avec Ancienne App'}
          subtitle={`${oldVersion}`}
          color={'text-[#b91c1c]'}

        />
    
        <Widget
          icon={<FaGoogle className="h-6 w-6" />}
          title={"Conducteur Go'Babi"}
          subtitle={`${driversByIdCode}`}
          color={'text-[#581c87]'}

        />
         <Widget
          icon={<FaPeopleGroup className="h-6 w-6" />}
          title={'Nombre de Client'}
          subtitle={`${totalRiders}`}
          color={'text-[#22c55e]'}

        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
        <CheckTable/>
          <CheckTableOther />
        </div>
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-1">
        {/* Check Table */}
          <MapCard />

      </div>
    </div>
  );
};

export default Dashboard;
