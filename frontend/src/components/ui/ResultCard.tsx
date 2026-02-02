import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ResultCardProps {
    result: {
        prediction: string;
        confidence: number;
        probabilities: {
            real: number;
            fake: number;
        };
    } | null;
}

export const ResultCard = ({ result }: ResultCardProps) => {
    if (!result) return null;

    const isFake = result.prediction.toLowerCase() === 'fake';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
                "mt-8 w-full max-w-xl overflow-hidden rounded-2xl border backdrop-blur-md p-8 text-center shadow-2xl transition-all duration-500",
                isFake
                    ? "border-red-500/30 bg-red-500/5 shadow-red-500/10 hover:shadow-red-500/20"
                    : "border-green-500/30 bg-green-500/5 shadow-green-500/10 hover:shadow-green-500/20"
            )}
        >
            <div className="mb-6 flex justify-center">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                    className={cn(
                        "flex h-20 w-20 items-center justify-center rounded-full ring-4 shadow-lg",
                        isFake ? "bg-red-500/10 ring-red-500/20 text-red-500" : "bg-green-500/10 ring-green-500/20 text-green-500"
                    )}>
                    {isFake ? <AlertTriangle className="h-10 w-10" /> : <CheckCircle className="h-10 w-10" />}
                </motion.div>
            </div>

            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-2 text-3xl font-bold tracking-tight text-white"
            >
                DETECTED: <span className={cn(isFake ? "text-red-400" : "text-green-400")}>{result.prediction.toUpperCase()}</span>
            </motion.h3>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8 text-gray-400"
            >
                Confidence Score: <span className="font-semibold text-white">{result.confidence.toFixed(2)}%</span>
            </motion.p>

            <div className="space-y-4">
                {/* Real Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium uppercase text-gray-400">
                        <span>Real Probability</span>
                        <span>{result.probabilities.real.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.probabilities.real}%` }}
                            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                            className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                        />
                    </div>
                </div>

                {/* Fake Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium uppercase text-gray-400">
                        <span>Fake Probability</span>
                        <span>{result.probabilities.fake.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.probabilities.fake}%` }}
                            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                            className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
