import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

export const AppLayout = () => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-[#0f0f13]">
            <Sidebar />
            <main className="ml-64 flex-1 p-8 overflow-x-hidden">
                <div className="mx-auto max-w-7xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};
