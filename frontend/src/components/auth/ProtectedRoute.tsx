import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { PendingApproval } from './PendingApproval';

interface ProtectedRouteProps {
    requireAdmin?: boolean;
}

export const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#0f0f13]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (profile?.status === 'pending') {
        return <PendingApproval />;
    }

    if (profile?.status === 'rejected') {
        // Could be a separate Rejected component
        return <PendingApproval />;
    }

    if (requireAdmin && profile?.role !== 'admin') {
        return <Navigate to="/" />; // Or AccessDenied page
    }

    return <Outlet />;
};
