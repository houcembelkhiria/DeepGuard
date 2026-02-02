import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart3, CheckCircle2, XCircle, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardStats {
    totalPredictions: number;
    realCount: number;
    fakeCount: number;
    recentPredictions: any[];
}

export const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalPredictions: 0,
        realCount: 0,
        fakeCount: 0,
        recentPredictions: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch total counts
            const { count: total, error: totalError } = await supabase
                .from('predictions')
                .select('*', { count: 'exact', head: true });

            if (totalError) throw totalError;

            // Fetch Real counts
            const { count: real, error: realError } = await supabase
                .from('predictions')
                .select('*', { count: 'exact', head: true })
                .eq('verdict', 'Real');

            if (realError) throw realError;

            // Fetch Fake counts
            const { count: fake, error: fakeError } = await supabase
                .from('predictions')
                .select('*', { count: 'exact', head: true })
                .eq('verdict', 'Fake');

            if (fakeError) throw fakeError;

            // Fetch recent predictions
            const { data: recent, error: recentError } = await supabase
                .from('predictions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (recentError) throw recentError;

            setStats({
                totalPredictions: total || 0,
                realCount: real || 0,
                fakeCount: fake || 0,
                recentPredictions: recent || []
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    const realPercentage = stats.totalPredictions > 0
        ? ((stats.realCount / stats.totalPredictions) * 100).toFixed(1)
        : '0';

    const fakePercentage = stats.totalPredictions > 0
        ? ((stats.fakeCount / stats.totalPredictions) * 100).toFixed(1)
        : '0';

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Scans"
                    value={stats.totalPredictions}
                    icon={ImageIcon}
                    color="blue"
                />
                <StatsCard
                    title="Real Images"
                    value={stats.realCount}
                    subValue={`${realPercentage}%`}
                    icon={CheckCircle2}
                    color="green"
                />
                <StatsCard
                    title="Fake Images"
                    value={stats.fakeCount}
                    subValue={`${fakePercentage}%`}
                    icon={XCircle}
                    color="red"
                />
                <StatsCard
                    title="Detection Rate"
                    value={`${stats.totalPredictions > 0 ? '100% active' : 'No data'}`}
                    icon={BarChart3}
                    color="purple"
                />
            </div>

            {/* Visualization Bars */}
            <div className="rounded-xl border border-white/10 bg-[#1a1a1f] p-6">
                <h3 className="mb-4 text-lg font-medium text-white">Distribution</h3>
                <div className="flex h-4 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                        className="bg-green-500 transition-all duration-1000"
                        style={{ width: `${realPercentage}%` }}
                    />
                    <div
                        className="bg-red-500 transition-all duration-1000"
                        style={{ width: `${fakePercentage}%` }}
                    />
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-green-500"></div> Real ({realPercentage}%)</span>
                    <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-red-500"></div> Fake ({fakePercentage}%)</span>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-white/10 bg-[#1a1a1f] p-6">
                <h3 className="mb-4 text-lg font-medium text-white">Recent Activity</h3>
                <div className="space-y-4">
                    {stats.recentPredictions.map((prediction) => (
                        <div key={prediction.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-4">
                                <img
                                    src={prediction.image_url}
                                    alt="Thumbnail"
                                    className="h-10 w-10 rounded object-cover"
                                />
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Analysis Result: <span className={prediction.verdict === 'Real' ? 'text-green-400' : 'text-red-400'}>{prediction.verdict}</span>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(prediction.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm font-bold text-white">
                                {prediction.confidence.toFixed(2)}%
                            </div>
                        </div>
                    ))}
                    {stats.recentPredictions.length === 0 && (
                        <p className="text-center text-gray-500">No recent activity found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, subValue, icon: Icon, color }: any) => {
    const colorStyles: any = {
        blue: 'bg-blue-500/10 text-blue-400',
        green: 'bg-green-500/10 text-green-400',
        red: 'bg-red-500/10 text-red-400',
        purple: 'bg-purple-500/10 text-purple-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-white/10 bg-[#1a1a1f] p-6"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
                    {subValue && <p className="mt-1 text-sm text-gray-500">{subValue}</p>}
                </div>
                <div className={`rounded-lg p-3 ${colorStyles[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </motion.div>
    );
};
