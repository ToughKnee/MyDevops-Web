"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    const navItems = [
        { name: 'General', path: '/', icon: 'https://www.svgrepo.com/show/371938/house.svg' },
        { name: 'Usuarios', path: '/users', icon: 'https://www.svgrepo.com/show/535711/user.svg' },
        { name: 'Contenido', path: '/content', icon: 'https://www.svgrepo.com/show/522137/grid.svg' },
        { name: 'Anal\u00EDticas', path: '/analytics', icon: 'https://www.svgrepo.com/show/491241/graph-asc.svg' },
        { name: 'Notificaciones', path: '/notifications', icon: 'https://www.svgrepo.com/show/505296/bell.svg' },
        { name: 'Configuraci\u00F3n', path: '/settings', icon: 'https://www.svgrepo.com/show/372653/settings.svg' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-full">
            <nav className="flex flex-col h-full">
                <div className="flex-1 py-4">
                    {/* Main Title */}
                    <div className="flex justify-center items-center">
                        <Link href="/" className="text-blue-950 text-xl pb-5">
                            UCRConnect
                        </Link>
                    </div>

                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <li key={item.path} className="relative">
                                    {active && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                    )}
                                    <Link
                                        href={item.path}
                                        className={`flex items-center px-6 py-3 transition-colors
                                            ${active
                                                ? 'text-blue-500'
                                                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <img
                                            src={item.icon}
                                            className={`w-5 h-5 mr-3 ${active ? '' : 'opacity-60'}`}
                                            alt={item.name}
                                        />
                                        <span className={active ? 'font-bold' : ''}>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </aside>
    );
}