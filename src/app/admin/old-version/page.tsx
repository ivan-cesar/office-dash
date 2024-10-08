"use client";
import { useEffect, useState } from 'react';
import { fetchDrivers, RowObj } from 'utils/dataService';
import OldVersionTable from 'components/admin/data-tables/OldVersionTable';

const Tables = () => {
  const [tableDataCheck, setTableDataCheck] = useState<RowObj[]>([]);

  useEffect(() => {
    const loadDrivers = async () => {
      const driversData = await fetchDrivers(); // Fetch the full object
      setTableDataCheck(driversData.data); // Only set the data property
    };

    loadDrivers(); // Call the function to load drivers
  }, []);

  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1">
        <OldVersionTable tableData={tableDataCheck} />
      </div>
    </div>
  );
};

export default Tables;
