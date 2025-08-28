import { CandleData } from '../data/sampleData';

export interface BollingerBandsSettings {
  length: number;
  maType: 'SMA';
  stdDevMultiplier: number;
  offset: number;
  source: 'close' | 'open' | 'high' | 'low';
}

export interface BollingerBandsData {
  timestamp: number;
  basis: number;
  upper: number;
  lower: number;
}

export interface BollingerBandsStyleSettings {
  basisVisible: boolean;
  upperVisible: boolean;
  lowerVisible: boolean;
  basisColor: string;
  upperColor: string;
  lowerColor: string;
  basisWidth: number;
  upperWidth: number;
  lowerWidth: number;
  basisStyle: 'solid' | 'dashed';
  upperStyle: 'solid' | 'dashed';
  lowerStyle: 'solid' | 'dashed';
  fillVisible: boolean;
  fillColor: string;
  fillOpacity: number;
}

export const defaultBollingerBandsSettings: BollingerBandsSettings = {
  length: 20,
  maType: 'SMA',
  stdDevMultiplier: 2,
  offset: 0,
  source: 'close'
};

export const defaultBollingerBandsStyleSettings: BollingerBandsStyleSettings = {
  basisVisible: true,
  upperVisible: true,
  lowerVisible: true,
  basisColor: '#FF6D00',
  upperColor: '#2196F3',
  lowerColor: '#2196F3',
  basisWidth: 1,
  upperWidth: 1,
  lowerWidth: 1,
  basisStyle: 'solid',
  upperStyle: 'solid',
  lowerStyle: 'solid',
  fillVisible: true,
  fillColor: '#2196F3',
  fillOpacity: 0.1
};

// Calculate Simple Moving Average
export const calculateSMA = (data: number[], period: number): number[] => {
  const sma: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(NaN); // Not enough data points
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
      sma.push(sum / period);
    }
  }
  
  return sma;
};

// Calculate Standard Deviation
export const calculateStandardDeviation = (data: number[], period: number, smaValues: number[]): number[] => {
  const stdDev: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1 || isNaN(smaValues[i])) {
      stdDev.push(NaN);
    } else {
      const periodData = data.slice(i - period + 1, i + 1);
      const mean = smaValues[i];
      const variance = periodData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period;
      stdDev.push(Math.sqrt(variance));
    }
  }
  
  return stdDev;
};

// Apply offset to data
export const applyOffset = (data: number[], offset: number): number[] => {
  if (offset === 0) return data;
  
  const result = new Array(data.length);
  
  for (let i = 0; i < data.length; i++) {
    const sourceIndex = i - offset;
    if (sourceIndex >= 0 && sourceIndex < data.length) {
      result[i] = data[sourceIndex];
    } else {
      result[i] = NaN;
    }
  }
  
  return result;
};

// Calculate Bollinger Bands
export const calculateBollingerBands = (
  candleData: CandleData[],
  settings: BollingerBandsSettings
): BollingerBandsData[] => {
  const { length, stdDevMultiplier, offset, source } = settings;
  
  // Extract source data (close prices by default)
  const sourceData = candleData.map(candle => candle[source]);
  
  // Calculate SMA (basis line)
  const smaValues = calculateSMA(sourceData, length);
  
  // Calculate Standard Deviation
  const stdDevValues = calculateStandardDeviation(sourceData, length, smaValues);
  
  // Calculate upper and lower bands
  const upperBand = smaValues.map((sma, i) => 
    isNaN(sma) || isNaN(stdDevValues[i]) ? NaN : sma + (stdDevMultiplier * stdDevValues[i])
  );
  
  const lowerBand = smaValues.map((sma, i) => 
    isNaN(sma) || isNaN(stdDevValues[i]) ? NaN : sma - (stdDevMultiplier * stdDevValues[i])
  );
  
  // Apply offset
  const offsetBasis = applyOffset(smaValues, offset);
  const offsetUpper = applyOffset(upperBand, offset);
  const offsetLower = applyOffset(lowerBand, offset);
  
  // Return formatted data
  return candleData.map((candle, i) => ({
    timestamp: candle.timestamp,
    basis: offsetBasis[i],
    upper: offsetUpper[i],
    lower: offsetLower[i]
  }));
};
