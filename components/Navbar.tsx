import React from 'react';
import { Car, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              AutoVision AI
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 py-1 px-3 rounded-full border border-slate-700">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>Powered by Gemini 2.5 Flash</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;