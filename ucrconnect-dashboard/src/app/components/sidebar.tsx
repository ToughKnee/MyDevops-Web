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

    return ( <div> </div> );
}