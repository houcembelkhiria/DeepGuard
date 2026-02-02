import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DropzoneProps {
    onFileSelect: (file: File) => void;
    isLoading?: boolean;
    file: File | null;
    clearFile: () => void;
}

export const Dropzone = ({ onFileSelect, isLoading, file, clearFile }: DropzoneProps) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1,
        disabled: isLoading || !!file,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles?.[0]) {
                onFileSelect(acceptedFiles[0]);
            }
        }
    });

    return (
        <div className="w-full max-w-xl mx-auto">
            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        {...(getRootProps() as any)}
                        className={cn(
                            "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all cursor-pointer overflow-hidden group",
                            isDragActive
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-white/10 hover:border-white/20 hover:bg-white/5 bg-white/[0.02]"
                        )}
                    >
                        <input {...getInputProps()} />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

                        <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <UploadCloud className="h-8 w-8 text-blue-400" />
                        </div>
                        <p className="z-10 text-lg font-medium text-white mb-2">
                            {isDragActive ? "Drop image here" : "Upload Image to Analyze"}
                        </p>
                        <p className="z-10 text-sm text-gray-400 text-center max-w-xs">
                            Drag & drop or click to browse. Supports JPG, PNG, WEBP.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-black/40">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="truncate text-lg font-medium text-white">{file.name}</h4>
                                <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                                {isLoading && (
                                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                        />
                                    </div>
                                )}
                            </div>

                            {!isLoading && (
                                <button
                                    onClick={clearFile}
                                    className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
