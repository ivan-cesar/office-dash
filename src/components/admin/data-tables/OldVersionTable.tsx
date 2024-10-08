import React, { useState, useEffect } from 'react';
import Card from 'components/card';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type RowObj = {
  nom: string;
  prenom: string;
  numero: string;
  email: string | null;
};

function OldVersionTable(props: { tableData: RowObj[] }) {
  const { tableData } = props;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<RowObj[]>([...tableData]);
  const [searchQuery, setSearchQuery] = useState('');

  const columnHelper = createColumnHelper<RowObj>();

  // Filtrer les données en fonction de la recherche
  useEffect(() => {
    const filteredData = tableData.filter((row) =>
      (row.nom?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (row.prenom?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (row.numero?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (row.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    setData(filteredData);
  }, [searchQuery, tableData]);
  

  const columns = [
    columnHelper.accessor('nom', {
      id: 'nom',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">NOM</p>
      ),
    }),
    columnHelper.accessor('prenom', {
      id: 'prenom',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">PRENOMS</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>
      ),
    }),
    columnHelper.accessor('numero', {
      id: 'numero',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">NUMERO</p>
      ),
    }),
    columnHelper.accessor('email', {
      id: 'email',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">EMAIL</p>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  // Fonction pour télécharger le tableau en PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Listes des clients ayant une course annulée", 14, 16);

    // Utilisation d'autoTable pour générer le tableau PDF
    (doc as any).autoTable({
      startY: 20,
      head: [['Nom', 'Prénom', 'Numéro', 'Email']],
      body: data.map((row) => [row.nom, row.prenom, row.numero, row.email || '']),
    });

    doc.save('tableau-clients.pdf');
  };

  return (
    <Card extra="w-full h-full sm:overflow-auto px-6">
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
        Listes des clients ayant une course annulée
        </div>
        {/* Bouton pour télécharger en PDF */}
        <button
          onClick={downloadPDF}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Télécharger en PDF
        </button>
      </header>

      {/* Champ de recherche */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer border-b border-gray-200 pb-2 pr-4 pt-4 text-start dark:border-white/30"
                  >
                    <div className="items-center justify-between text-xs text-gray-200">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="min-w-[150px] border-white/0 py-3 pr-4">
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

export default OldVersionTable;
