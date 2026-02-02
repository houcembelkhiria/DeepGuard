import { ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';

export const PendingApproval = () => {
    const { user } = useAuth();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f0f13] text-white p-4">
            <div className="flex max-w-md flex-col items-center text-center space-y-6 rounded-2xl border border-white/10 bg-[#1a1a1f] p-8">
                <div className="rounded-full bg-yellow-500/20 p-4">
                    <ShieldAlert className="h-12 w-12 text-yellow-500" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Account Pending Approval</h1>
                    <p className="text-gray-400">
                        Hello <span className="text-white font-medium">{user?.email}</span>, your account has been created but requires administrator approval before you can access the platform.
                    </p>
                </div>

                <div className="rounded-lg bg-white/5 p-4 text-sm text-gray-500">
                    You will be notified once your account status is updated.
                </div>

                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
            </div>
        </div>
    );
};
