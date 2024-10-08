import React, { useEffect, useState } from "react";
import Card from "components/card";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { TailSpin } from "react-loader-spinner"; // Import du spinner
import axios from "axios"; // Assurez-vous d'importer axios

type Driver = {
  id: number;
  first_name: string;
  last_name: string;
  contact_number: string;
  status: string; // Le statut est directement récupéré de l'API
};

function CheckTableOther() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<Driver>();
  const columns = [
    columnHelper.accessor("first_name", {
      id: "first_name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">NOM</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    // columnHelper.accessor("contact_number", {
    //   id: "contact_number",
    //   header: () => (
    //     <p className="text-sm font-bold text-gray-600 dark:text-white">
    //       TÉLÉPHONE
    //     </p>
    //   ),
    //   cell: (info) => (
    //     <p className="text-sm font-bold text-navy-700 dark:text-white">
    //       {info.getValue()}
    //     </p>
    //   ),
    // }),
    columnHelper.accessor("status", {
      id: "status",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          STATUT
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <span
            className={`w-3 h-3 rounded-full ${
              info.getValue() === "en ligne" ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <p className="ml-2 text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        </div>
      ),
    }),
  ];

  // Fonction pour récupérer les chauffeurs
  const fetchDrivers = async () => {
    try {
      const response = await axios.get("https://appgobabi.com/api/drivers-by-id-code", {
        timeout: 10000, // Timeout de 10 secondes
      });

      // Utiliser le champ status directement depuis la réponse
      const driversWithStatus = response.data.drivers_with_null_id_code.drivers.map((driver: Driver) => ({
        ...driver,
        status: driver.status, // Utilisez directement le champ status
      }));

      setDrivers(driversWithStatus);
      setLoading(false);
    } catch (err) {
      // Améliorez le message d'erreur
      if (axios.isAxiosError(err)) {
        setError(`Erreur lors de la récupération des données : ${err.message}`);
      } else {
        setError(`Erreur inconnue : ${err}`);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers(); // Appel initial pour récupérer les chauffeurs
  }, []);

  const table = useReactTable({
    data: drivers,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TailSpin
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          visible={true}
        />
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl text-center font-bold text-navy-700 dark:text-white">
          Chauffeurs Go'Babi
        </div>
      </header>
      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="min-w-[150px] border-white/0 py-3 pr-4"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default CheckTableOther;
