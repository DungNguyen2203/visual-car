import React, { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      onImageSelected(base64data, file.type);
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const triggerInput = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      
      <div
        className={`relative group cursor-pointer transition-all duration-300 ease-in-out border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center overflow-hidden
          ${dragActive 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-slate-600 bg-slate-800/40 hover:bg-slate-800/60 hover:border-blue-400'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInput}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex flex-col items-center justify-center relative z-10 space-y-4">
          <div className={`p-4 rounded-full bg-slate-700/50 ring-1 ring-slate-600 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:ring-blue-500 transition-all duration-300`}>
            {isLoading ? (
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-400" />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">
              {isLoading ? 'Đang phân tích...' : 'Tải ảnh xe lên'}
            </h3>
            <p className="text-sm text-slate-400">
              Kéo thả hoặc nhấn để chọn ảnh (JPG, PNG)
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4">
             <button className="px-4 py-2 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    triggerInput();
                }}
             >
                 <ImageIcon className="w-3 h-3" /> Thư viện
             </button>
             <div className="text-xs text-slate-500">hoặc</div>
             <button className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                onClick={(e) => {
                    e.stopPropagation();
                    triggerInput();
                }}
             >
                 <Camera className="w-3 h-3" /> Chụp ảnh
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;