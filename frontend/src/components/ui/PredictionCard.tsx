import { Calendar, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { PredictionDetailsModal } from './PredictionDetailsModal';

interface Prediction {
    id: string;
    image_url: string;
    verdict: 'Real' | 'Fake' | 'real' | 'fake';
    confidence: number;
    created_at: string;
    probabilities?: {
        Real?: number;
        Fake?: number;
    };
}

interface PredictionCardProps {
    prediction: Prediction;
}

export const PredictionCard = ({ prediction }: PredictionCardProps) => {
    const [showDetails, setShowDetails] = useState(false);
    const isReal = prediction.verdict.toLowerCase() === 'real';
    const date = new Date(prediction.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <>
            <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1f] transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
                {/* Image Section */}
                <div className="aspect-square w-full overflow-hidden bg-black/50 relative">
                    <img
                        src={prediction.image_url}
                        alt="Analysis Result"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />

                    {/* Hover Overlay with Eye Icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                            onClick={() => setShowDetails(true)}
                            className="rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20 hover:scale-110 transition-all border border-white/20"
                        >
                            <Eye className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${isReal
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {isReal ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            {prediction.verdict}
                        </div>
                        <span className="text-sm font-bold text-white">
                            {prediction.confidence.toFixed(2)}%
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {date}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                            onClick={() => setShowDetails(true)}
                        >
                            View Details
                        </Button>
                    </div>
                </div>
            </div>

            {showDetails && (
                <PredictionDetailsModal
                    prediction={prediction}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </>
    );
};
