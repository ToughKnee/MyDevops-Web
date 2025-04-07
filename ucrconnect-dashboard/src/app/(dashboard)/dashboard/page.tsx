'use client';
import { useEffect, useState } from 'react';
import StatCard from '../../components/statCard';
import Link from 'next/link';

export default function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState([]);

  useEffect(() => {
    fetch('/data/dashboardData.json')
      .then((response) => response.json())
      .then((data) => setDashboardStats(data))
      .catch((error) => console.error('Error al cargar los datos:', error));
  }, []);

  return (
    <div className="space-y-6">
      {/* <div className="bg-white p-6 rounded-lg shadow-sm"> */}
        {/* <h1 className="text-2xl font-semibold text-gray-800 mb-4">Vista General</h1> */}

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
            {dashboardStats.map(({ title, value, change, route }, index) => {
              const isUsuarios = title === 'Usuarios';  // Special case for "Users"
              const customBgStyle = isUsuarios
                ? 'bg-gradient-to-tr from-[#249DD8] to-[#41ADE7BF] text-white'
                : undefined;

              return (
                <div
                  key={title + index}
                  className="transition-transform transform hover:scale-104 cursor-pointer"
                >
                  <Link href={route || '#'} passHref>
                    <StatCard
                      title={title}
                      value={value}
                      change={change}
                      route={route}
                      bgStyle={customBgStyle}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      {/* </div> */}
    </div>
  );
}
