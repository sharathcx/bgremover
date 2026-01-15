'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
    clearFile: () => void;
}

export function FileUpload({ onFileSelect, selectedFile, clearFile }: FileUploadProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-8">
            <AnimatePresence mode="wait">
                {!selectedFile ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className={cn(
                            "relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-3xl border-2 border-dashed transition-all duration-300",
                            isDragActive
                                ? "border-accent bg-accent/10 scale-[1.02]"
                                : "border-gray-700 bg-gray-900/50 hover:border-primary/50 hover:bg-gray-800/50"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleChange}
                        />

                        <div className="flex flex-col items-center space-y-4 text-center p-6">
                            <motion.div
                                animate={{
                                    y: isDragActive ? -10 : 0,
                                    scale: isDragActive ? 1.1 : 1
                                }}
                                className="p-4 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 shadow-lg shadow-purple-500/20"
                            >
                                <Upload className="w-8 h-8 text-white" />
                            </motion.div>
                            <div className="space-y-1">
                                <p className="text-xl font-semibold text-gray-200">
                                    {isDragActive ? "Drop it here!" : "Upload an Image"}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Drag and drop or click to browse
                                </p>
                            </div>
                        </div>

                        {/* Background Glow Effect */}
                        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="file-preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center justify-between w-full p-4 glass-card rounded-2xl"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-primary/20 rounded-xl">
                                <FileImage className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white max-w-[200px] truncate">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); clearFile(); }}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
