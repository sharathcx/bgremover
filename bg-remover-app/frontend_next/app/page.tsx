'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { ResultCard } from '@/components/ResultCard';
import { Button } from '@/components/ui/button';

interface ComparisonResult {
  [modelName: string]: string;
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Small artificial delay for animation smoothness if backend is too fast
      await new Promise(resolve => setTimeout(resolve, 800));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await axios.post(`${apiUrl}/remove-bg`, formData);
      setResults(response.data);
    } catch (err) {
      setError("Unable to connect to the processing server.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Precision 2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white"
          >
            Remove Backgrounds <br />
            <span className="text-gradient">in Seconds.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Upload your image and instantly compare 5 state-of-the-art AI models to find the perfect cut for your commercial needs.
          </motion.p>
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-center gap-8 mb-20">
          <FileUpload
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            clearFile={() => { setSelectedFile(null); setResults(null); }}
          />

          <AnimatePresence>
            {selectedFile && !results && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Button
                  onClick={handleProcess}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-lg px-8 py-6 rounded-full shadow-lg shadow-purple-500/25 transition-all hover:scale-105"
                >
                  Start Processing <Sparkles className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-4 my-20"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <Loader2 className="w-16 h-16 text-white animate-spin relative z-10" />
              </div>
              <p className="text-lg text-gray-300 font-medium">Analyzing pixels...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Grid */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-2xl font-bold text-white">Comparison Results</h2>
                <span className="text-sm text-gray-400">Showing 5 models</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(results).map(([modelName, imageSrc], index) => {
                  if (modelName === 'original') return null;
                  return (
                    <ResultCard
                      key={modelName}
                      modelName={modelName}
                      resultSrc={imageSrc}
                      originalSrc={results['original']}
                      index={index}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg text-center"
          >
            {error}
          </motion.div>
        )}

      </div>
    </main>
  );
}
