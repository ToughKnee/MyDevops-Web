'use client';
import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link'; // Importamos Link de Next.js

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
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Vista General</h1>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
            {dashboardStats.map(({ title, value, change, route }) => {
              const isPositive = change >= 0;
              const ArrowIcon = isPositive ? ArrowUp : ArrowDown;
              const changeBg = isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
              const bgStyle =
                title === 'Usuarios' ? 'bg-gradient-to-tr from-[#249DD8] to-[#41ADE7BF] text-white' : 'bg-white border border-gray-300 text-gray-900';

              return (
                <Link key={title} href={route} passHref>
                  <div
                    className={`p-6 rounded-[25px] flex flex-col justify-between h-[150px] ${bgStyle} transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer`}
                  >
                    <h3 className="text-lg font-medium">{title}</h3>
                    <div className="flex items-start">
                      <p className="text-5xl font-bold">{value}</p>
                      <div className={`flex items-center px-2 py-0.5 rounded-md ml-2 text-sm font-medium ${changeBg}`}>
                        <ArrowIcon className="w-3 h-3" />
                        <span className="ml-1">{isPositive ? '+' : ''}{change}%</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
