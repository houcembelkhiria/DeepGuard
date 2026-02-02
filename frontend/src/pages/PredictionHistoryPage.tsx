import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { PredictionCard } from '../components/ui/PredictionCard';

export const PredictionHistoryPage = () => {
    const { user } = useAuth();
    const [predictions, setPredictions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('predictions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setPredictions(data || []);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-64 w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Prediction History</h1>
                    <p className="mt-2 text-gray-400">View your past analysis results.</p>
                </div>
                <div className="rounded-lg bg-white/5 px-4 py-2 text-sm text-gray-400 border border-white/10">
                    Total Scans: <span className="font-bold text-white ml-1">{predictions.length}</span>
                </div>
            </div>

            {predictions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#1a1a1f] p-12 text-center">
                    <p className="text-lg font-medium text-white">No history found</p>
                    <p className="mt-2 text-sm text-gray-400">Upload an image to start analyzing.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {predictions.map((prediction) => (
                        <PredictionCard key={prediction.id} prediction={prediction} />
                    ))}
                </div>
            )}
        </div>
    );
};
