import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { CheckCircle, XCircle, Shield, Clock } from 'lucide-react';

interface Profile {
    id: string;
    email: string;
    role: 'user' | 'admin';
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export const UserManagementPage = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        userId: string | null;
        status: 'approved' | 'rejected' | null;
        userEmail?: string;
    }>({ isOpen: false, userId: null, status: null });

    const fetchProfiles = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProfiles(data || []);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (userId: string, newStatus: 'approved' | 'rejected') => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ status: newStatus })
                .eq('id', userId);

            if (error) throw error;
            await fetchProfiles(); // Refresh list
        } catch (error: any) {
            console.error('Error updating status:', error);
            alert(`Failed to update status: ${error.message || 'Unknown error'}`);
        }
    };

    const handleActionClick = (userId: string, email: string, status: 'approved' | 'rejected') => {
        setConfirmModal({ isOpen: true, userId, status, userEmail: email });
    };

    const handleConfirm = () => {
        if (confirmModal.userId && confirmModal.status) {
            updateStatus(confirmModal.userId, confirmModal.status);
        }
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        }
    };

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>

            <div className="rounded-xl border border-white/10 bg-[#1a1a1f] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase text-gray-200">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {profiles.map((profile) => (
                                <tr key={profile.id} className="hover:bg-white/5">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{profile.email}</div>
                                        <div className="text-xs text-gray-500">{profile.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {profile.role === 'admin' ? (
                                                <Shield className="h-4 w-4 text-purple-400" />
                                            ) : (
                                                <div className="h-4 w-4" />
                                            )}
                                            <span className={profile.role === 'admin' ? 'text-purple-400' : ''}>
                                                {profile.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(profile.status)}`}>
                                            {profile.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                                            {profile.status === 'rejected' && <XCircle className="h-3 w-3" />}
                                            {profile.status === 'pending' && <Clock className="h-3 w-3" />}
                                            {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(profile.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {profile.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white border-none"
                                                    onClick={() => handleActionClick(profile.id, profile.email, 'approved')}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                    onClick={() => handleActionClick(profile.id, profile.email, 'rejected')}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={handleConfirm}
                title={confirmModal.status === 'approved' ? 'Approve User' : 'Reject User'}
                message={`Are you sure you want to ${confirmModal.status} access for ${confirmModal.userEmail}?`}
                type={confirmModal.status === 'rejected' ? 'danger' : 'info'}
                confirmText={confirmModal.status === 'approved' ? 'Approve' : 'Reject'}
            />
        </div>
    );
};
