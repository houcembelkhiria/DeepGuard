import { X, Calendar, CheckCircle2, XCircle, Activity, FileText } from 'lucide-react';
import { Button } from '../ui/Button';

interface Prediction {
    id: string;
    image_url: string;
    verdict: 'Real' | 'Fake' | 'real' | 'fake';
    confidence: number;
    created_at: string;
    probabilities?: {
        Real?: number;
        Fake?: number;
        real?: number;
        fake?: number;
    };
}

interface PredictionDetailsModalProps {
    prediction: Prediction;
    onClose: () => void;
}

export const PredictionDetailsModal = ({ prediction, onClose }: PredictionDetailsModalProps) => {
    const isReal = prediction.verdict.toLowerCase() === 'real';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1f] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 p-6">
                    <h2 className="text-xl font-bold text-white">Prediction Details</h2>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 bg-black/50 p-6 flex items-center justify-center">
                        <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-xl border border-white/10">
                            <img
                                src={prediction.image_url}
                                alt="Analysis Subject"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-1/2 p-6 space-y-6">
                        {/* Verdict Badge */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verdict</label>
                            <div className={`flex items-center gap-3 rounded-lg border p-4 ${isReal
                                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                {isReal ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                                <span className="text-lg font-bold">{prediction.verdict}</span>
                            </div>
                        </div>

                        {/* Confidence Score */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence Score</label>
                            <div className="flex items-center gap-2 text-white">
                                <Activity className="h-5 w-5 text-blue-400" />
                                <span className="text-2xl font-bold">{prediction.confidence.toFixed(2)}%</span>
                            </div>
                            {/* Simple Progress Bar */}
                            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${isReal ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ width: `${prediction.confidence}%` }}
                                />
                            </div>
                        </div>

                        {/* Analysis Timestamp */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Analyzed On</label>
                            <div className="flex items-center gap-2 text-gray-300">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>{new Date(prediction.created_at).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Technical Metadata (Probabilities) */}
                        {prediction.probabilities && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="h-3 w-3" /> Technical Data
                                </label>
                                <div className="rounded-lg bg-black/30 p-3 text-xs font-mono text-gray-400 border border-white/5">
                                    <pre className="whitespace-pre-wrap">
                                        {JSON.stringify(prediction.probabilities, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
