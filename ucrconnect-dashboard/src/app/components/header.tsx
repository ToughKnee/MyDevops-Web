'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {

    // Get current path to determine section title
    const pathname = usePathname();

    // Map paths to section titles
    const getSectionTitle = () => {
        const pathTitles: Record<string, string> = {
            '/': 'Vista General',
            '/users': 'Usuarios',
            '/content': 'Contenido',
            '/analytics': 'Anal\u00EDticas',
            '/notifications': 'Notificaciones',
            '/settings': 'Configuraci\u00F3n'
        };

        return pathTitles[pathname] || ' ';
    };

    return (<div></div>);
}