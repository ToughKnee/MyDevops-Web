'use client';

import Link from 'next/link';

export default function Users() {
  return (
    <div>
      <h1 className="text-gray-800">Users</h1>
      <Link href="/users/register">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition">
          Registrar nuevo usuario
        </button>
      </Link>
    </div>
  );
}