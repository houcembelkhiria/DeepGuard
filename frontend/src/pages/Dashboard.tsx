import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Dropzone } from '../components/ui/Dropzone';
import { ResultCard } from '../components/ui/ResultCard';
import axios from 'axios';
import { motion } from 'framer-motion';

export const Dashboard = () => {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    // ... processImage function remains the same ...
    const processImage = async (selectedFile: File) => {
        setLoading(true);
        setResult(null);

        try {

            // 1. Upload to Backend for Prediction
            // Using relative path for Nginx proxy or direct localhost for dev
            const BACKEND_URL = import.meta.env.PROD ? '/api/predict' : 'http://localhost:9142/predict';

            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post(BACKEND_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const predictionResult = response.data;
            setResult(predictionResult);

            // 2. Upload to Supabase Storage (Buckets)
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(fileName, selectedFile);

            if (uploadError) throw uploadError;

            // 3. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('uploads')
                .getPublicUrl(fileName);

            // 4. Save Record to Database
            const { error: dbError } = await supabase
                .from('predictions')
                .insert({
                    user_id: user?.id,
                    image_url: publicUrl,
                    verdict: predictionResult.prediction,
                    confidence: predictionResult.confidence,
                    probabilities: predictionResult.probabilities
                });

            if (dbError) throw dbError;

        } catch (error) {
            console.error(error);
            alert('Error processing image. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-2xl text-center"
            >
                <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                    Is it Real or Fake?
                </h1>
                <p className="text-lg text-gray-400">
                    Advanced AI detection to identify deepfake imagery with high precision. Upload an image to analyze its authenticity instantly.
                </p>
            </motion.div>

            <div className="flex flex-col items-center gap-8">
                <Dropzone
                    file={file}
                    onFileSelect={(f) => { setFile(f); processImage(f); }}
                    clearFile={() => { setFile(null); setResult(null); }}
                    isLoading={loading}
                />

                <ResultCard result={result} />
            </div>
        </div>
    );
};
