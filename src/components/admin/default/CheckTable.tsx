import React, { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender, SortingState, createColumnHelper } from "@tanstack/react-table";
import Card from "components/card";


type Driver = {
  first_name: string;
  contact_number: string;
};

function CheckTable() {
  const [chauffeurs, setChauffeurs] = useState<Driver[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [tri, setTri] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<Driver>();

  const colonnes = [
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
    columnHelper.accessor("contact_number", {
      id: "contact_number",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          TÉLÉPHONE
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
  ];

  useEffect(() => {
    // Appel de l'API pour récupérer les chauffeurs
    fetch("https://appgobabi.com/api/drivers-by-id-code")
      .then((response) => response.json())
      .then((data) => {
        setChauffeurs(data.drivers_with_non_null_id_code.drivers); // Mise à jour des données des chauffeurs
        setChargement(false);
      })
      .catch((err) => {
        setErreur("Erreur lors de la récupération des données");
        setChargement(false);
      });
  }, []);
console.log("chauffeurs :",chauffeurs);
  const table = useReactTable({
    data: chauffeurs,
    columns: colonnes,
    state: {
      sorting: tri,
    },
    onSortingChange: setTri,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (chargement) {
    return <p>Chargement...</p>;
  }

  if (erreur) {
    return <p>{erreur}</p>;
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
                    className="min-w-[150px] border-white/0 py-3  pr-4"
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

export default CheckTable;
