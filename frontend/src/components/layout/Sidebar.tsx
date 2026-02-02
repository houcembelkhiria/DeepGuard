import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import {
    ShieldCheck,
    UploadCloud,
    Users,
    History,
    LogOut,
    LayoutDashboard
} from 'lucide-react';

import { motion } from 'framer-motion';

export const Sidebar = () => {
    const { user, profile } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const navItems = [
        { to: '/app', icon: UploadCloud, label: 'Upload Image' },
        ...(profile?.role === 'admin' ? [
            { to: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/users', icon: Users, label: 'User Management' }
        ] : []),
        { to: '/history', icon: History, label: 'Prediction History' },
    ];

    return (
        <>
            <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-[#0f0f13] flex flex-col z-40">
                {/* Logo Area */}
                <div className="flex h-16 items-center border-b border-white/10 px-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">DeepGuard</span>
                    </motion.div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-4 py-6">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${isActive
                                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-3"
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </motion.div>

                            {/* Animated indicator for active state */}
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    isActive ? "absolute left-0 h-6 w-1 rounded-r-full bg-white shadow-[0_0_10px_white]" : "hidden"
                                }
                            />
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile & Logout */}
                <div className="border-t border-white/10 p-4">
                    <div className="mb-4 flex items-center gap-3 px-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-medium text-white">{user?.email}</p>
                            <p className="text-xs text-gray-400">Authenticated</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-400 hover:text-white"
                        onClick={() => setShowLogoutConfirm(true)}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            <ConfirmationModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleSignOut}
                title="Sign Out"
                message="Are you sure you want to sign out?"
                confirmText="Sign Out"
                type="danger"
            />
        </>
    );
};
