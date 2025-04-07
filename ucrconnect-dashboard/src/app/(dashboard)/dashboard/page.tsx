'use client';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Vista General</h1>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
            {/* Usuarios */}
            <div className="p-6 rounded-[25px] flex flex-col justify-between h-[150px]" style={{ background: 'linear-gradient(114deg, #249DD8 3.12%, rgba(65, 173, 231, 0.75) 98.3%)' }}>
              <h3 className="text-lg font-medium text-white">Usuarios</h3>
              <div className="flex items-start">
                <p className="text-5xl font-bold text-white">924</p>
                <div className="flex items-center bg-green-100 text-green-800 px-2 py-0.5 rounded-md ml-2 text-sm font-medium">
                  <ArrowUp className="w-3 h-3" />
                  <span className="ml-1">+9%</span>
                </div>
              </div>
            </div>

            {/* Reportes */}
            <div className="p-6 border border-gray-300 rounded-[25px] flex flex-col justify-between h-[150px] bg-white">
              <h3 className="text-lg font-medium text-gray-800">Reportes</h3>
              <div className="flex items-start">
                <p className="text-5xl font-bold text-gray-900">12</p>
                <div className="flex items-center bg-red-100 text-red-800 px-2 py-0.5 rounded-md ml-2 text-sm font-medium">
                  <ArrowDown className="w-3 h-3" />
                  <span className="ml-1">-34%</span>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="p-6 border border-gray-300 rounded-[25px] flex flex-col justify-between h-[150px] bg-white">
              <h3 className="text-lg font-medium text-gray-800">Posts</h3>
              <div className="flex items-start">
                <p className="text-5xl font-bold text-gray-900">2678</p>
                <div className="flex items-center bg-green-100 text-green-800 px-2 py-0.5 rounded-md ml-2 text-sm font-medium">
                  <ArrowUp className="w-3 h-3" />
                  <span className="ml-1">+43%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
