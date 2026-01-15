'use client';

import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultCardProps {
    modelName: string;
    resultSrc: string;
    originalSrc: string;
    index: number;
}

export function ResultCard({ modelName, resultSrc, originalSrc, index }: ResultCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl glass-card glass-card-hover"
        >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm flex justify-between items-center z-10">
                <h3 className="font-semibold text-gray-100 capitalize tracking-wide">
                    {modelName.replace(/-/g, ' ')}
                </h3>
                <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300 font-mono border border-white/5">
                    AI MODEL
                </span>
            </div>

            {/* Image Area */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[url('https://t3.ftcdn.net/jpg/02/72/06/15/360_F_272061595_gA1h0x20e03e03e03e.jpg')] bg-repeat bg-[length:400px_400px]">

                {/* Result (Base Layer) */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={resultSrc}
                        alt={modelName}
                        className="h-full w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Original (Overlay Layer) */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={originalSrc}
                            alt="Original"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    {/* Floating Label */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 text-white text-xs font-bold rounded-full shadow-lg border border-white/20 backdrop-blur-md flex items-center gap-2"
                    >
                        <Eye className="w-3 h-3" />
                        Viewing Original
                    </motion.div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-white/5 border-t border-white/10 mt-auto">
                <Button
                    variant="outline"
                    className="w-full bg-white/5 border-white/10 text-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 gap-2 group/btn"
                    asChild
                >
                    <a href={resultSrc} download={`${modelName}_result.png`}>
                        <Download className="w-4 h-4 group-hover/btn:animate-bounce" />
                        Download HD
                    </a>
                </Button>
            </div>
        </motion.div>
    );
}
