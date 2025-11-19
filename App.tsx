import React, { useState } from 'react';
import Navbar from './components/Navbar';
import UploadZone from './components/UploadZone';
import Results from './components/Results';
import { analyzeImage } from './services/geminiService';
import { AnalysisState } from './types';
import { Scan, X, Github } from 'lucide-react';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const handleImageSelected = async (base64: string, type: string) => {
    setImage(base64);
    setMimeType(type);
    setAnalysis({ status: 'loading', data: null, error: null });

    try {
      const result = await analyzeImage(base64, type);
      setAnalysis({ status: 'success', data: result, error: null });
    } catch (error: any) {
      setAnalysis({ 
        status: 'error', 
        data: null, 
        error: error.message || 'Có lỗi xảy ra khi phân tích ảnh.' 
      });
    }
  };

  const resetApp = () => {
    setImage(null);
    setAnalysis({ status: 'idle', data: null, error: null });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        {!image && (
            <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                    Nhận diện xe bằng <span className="text-blue-500">Gemini AI</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
                    Tải lên ảnh xe để biết hãng, mẫu, năm sản xuất và ước tính giá trị ngay lập tức.
                </p>
            </div>
        )}

        {/* Main Interaction Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Preview */}
          <div className={`lg:col-span-${image ? '5' : '12'} transition-all duration-500`}>
            {image ? (
              <div className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shadow-2xl animate-fade-in">
                <img 
                  src={image} 
                  alt="Uploaded Vehicle" 
                  className="w-full h-auto object-cover max-h-[500px]"
                />
                
                {/* Scanning Effect Overlay */}
                {analysis.status === 'loading' && (
                  <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="relative">
                      <Scan className="w-16 h-16 text-blue-400 animate-pulse" />
                      <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                    </div>
                    <p className="mt-4 text-blue-200 font-medium animate-pulse">Đang quét dữ liệu xe...</p>
                  </div>
                )}

                {/* Reset Button */}
                <button 
                  onClick={resetApp}
                  className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-red-500/90 text-white rounded-full backdrop-blur-md transition-all shadow-lg"
                  title="Chọn ảnh khác"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <UploadZone 
                onImageSelected={handleImageSelected} 
                isLoading={analysis.status === 'loading'} 
              />
            )}
          </div>

          {/* Right Column: Results */}
          {image && (
            <div className="lg:col-span-7 transition-all duration-500">
              {analysis.status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-200">
                  <p className="font-semibold">Đã xảy ra lỗi:</p>
                  <p>{analysis.error}</p>
                  <button onClick={resetApp} className="mt-4 text-sm underline hover:text-white">Thử lại</button>
                </div>
              )}

              {analysis.status === 'success' && analysis.data && (
                <Results data={analysis.data} />
              )}
            </div>
          )}

        </div>
      </main>

      <footer className="border-t border-slate-800 py-8 mt-auto bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} AutoVision AI.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}