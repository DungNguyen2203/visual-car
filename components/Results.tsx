import React from 'react';
import { VehicleAnalysis } from '../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Gauge, 
  Palette, 
  Calendar, 
  Tag,
  Info,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ResultsProps {
  data: VehicleAnalysis;
}

const Results: React.FC<ResultsProps> = ({ data }) => {
  if (!data.isVehicle) {
    return (
      <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center animate-fade-in">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-red-400 mb-2">Không tìm thấy xe</h3>
        <p className="text-slate-300">
          AI không thể nhận diện phương tiện trong hình ảnh này. Vui lòng thử lại với hình ảnh rõ nét hơn.
        </p>
      </div>
    );
  }

  // Data for chart
  const chartData = [
    { name: 'Độ tin cậy', value: data.confidenceScore },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Info */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CarIconLarge />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">{data.make}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {data.model}
            </h2>
            <div className="flex flex-wrap gap-3">
              <Badge icon={<Calendar className="w-3 h-3" />} text={data.yearRange} color="bg-slate-700 text-slate-200" />
              <Badge icon={<Palette className="w-3 h-3" />} text={data.color} color="bg-slate-700 text-slate-200" />
              <Badge icon={<CarIconSmall />} text={data.type} color="bg-blue-600/20 text-blue-300 border border-blue-500/30" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700">
            <div className="text-right">
              <div className="text-xs text-slate-400">Độ chính xác AI</div>
              <div className="text-xl font-bold text-green-400">{data.confidenceScore}%</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Description & Features */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Info className="w-5 h-5 text-blue-400" />
            Tổng quan
          </h3>
          <p className="text-slate-300 leading-relaxed">
            {data.description}
          </p>
          
          <div className="pt-4 border-t border-slate-700/50">
             <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Tính năng nổi bật</h4>
             <div className="flex flex-wrap gap-2">
               {data.features.map((feature, index) => (
                 <span key={index} className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-md text-sm transition-colors border border-slate-600">
                   {feature}
                 </span>
               ))}
             </div>
          </div>
        </div>

        {/* Performance & Stats */}
        <div className="space-y-6">
            {/* Specs Card */}
            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-white mb-4">
                    <Gauge className="w-5 h-5 text-purple-400" />
                    Thông số & Giá trị
                </h3>
                <div className="space-y-4">
                    <StatRow label="Giá ước tính" value={data.estimatedPrice} highlight />
                    <StatRow label="Tốc độ tối đa" value={data.performance?.topSpeed || "N/A"} />
                    <StatRow label="Tăng tốc (0-100)" value={data.performance?.acceleration || "N/A"} />
                </div>
            </div>

            {/* Visual Chart */}
            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 h-48">
                <h4 className="text-xs font-medium text-slate-400 mb-2 uppercase">Độ tin cậy nhận diện</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={chartData} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{fill: 'transparent'}}
                        />
                        <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]} background={{ fill: '#334155' }}>
                             <Cell fill={data.confidenceScore > 80 ? '#10b981' : '#f59e0b'} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const Badge = ({ icon, text, color }: { icon: React.ReactNode, text: string, color: string }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${color}`}>
    {icon}
    <span>{text}</span>
  </div>
);

const StatRow = ({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
    <span className="text-slate-400">{label}</span>
    <span className={`font-medium ${highlight ? 'text-green-400 text-lg' : 'text-slate-200'}`}>
      {value}
    </span>
  </div>
);

const CarIconSmall = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const CarIconLarge = () => (
    <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
);

export default Results;