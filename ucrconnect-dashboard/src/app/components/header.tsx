'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    // Panel states
    const [openSettings, setOpenSettings] = useState(false);
    const [openNotifications, setNotifications] = useState(false);

    // Animation states
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [notificationsVisible, setNotificationsVisible] = useState(false);

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

    // Refs for the animation timeouts
    const settingsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const notificationsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Function to handle opening settings and closing notifications
    const handleSettingsClick = () => {
        // If settings is already open, start closing animation
        if (openSettings) {
            setSettingsVisible(false);
            settingsTimeoutRef.current = setTimeout(() => {
                setOpenSettings(false);
            }, 150);
        } else {
            // If notifications is open, close it
            if (openNotifications) {
                setNotificationsVisible(false);
                notificationsTimeoutRef.current = setTimeout(() => {
                    setNotifications(false);
                    // Then open settings
                    setOpenSettings(true);
                    setTimeout(() => setSettingsVisible(true), 50);
                }, 150);
            } else {
                // Just open settings
                setOpenSettings(true);
                setTimeout(() => setSettingsVisible(true), 50);
            }
        }
    };

    // Function to handle opening notifications and closing settings
    const handleNotificationsClick = () => {
        // If notifications is already open, start closing animation
        if (openNotifications) {
            setNotificationsVisible(false);
            notificationsTimeoutRef.current = setTimeout(() => {
                setNotifications(false);
            }, 150);
        } else {
            // If settings is open, close it
            if (openSettings) {
                setSettingsVisible(false);
                settingsTimeoutRef.current = setTimeout(() => {
                    setOpenSettings(false);
                    // Then open notifications
                    setNotifications(true);
                    setTimeout(() => setNotificationsVisible(true), 50);
                }, 150);
            } else {
                // Just open notifications
                setNotifications(true);
                setTimeout(() => setNotificationsVisible(true), 50);
            }
        }
    };

    // Clean up timeouts when component unmounts
    useEffect(() => {
        return () => {
            if (settingsTimeoutRef.current) clearTimeout(settingsTimeoutRef.current);
            if (notificationsTimeoutRef.current) clearTimeout(notificationsTimeoutRef.current);
        };
    }, []);

    return (<div></div>);
}