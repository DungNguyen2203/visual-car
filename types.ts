export interface VehicleAnalysis {
  isVehicle: boolean;
  make: string;
  model: string;
  yearRange: string;
  type: string;
  color: string;
  estimatedPrice: string;
  features: string[];
  description: string;
  performance: {
    topSpeed: string;
    acceleration: string;
  };
  confidenceScore: number;
}

export interface AnalysisState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: VehicleAnalysis | null;
  error: string | null;
}