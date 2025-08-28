'use client';

import React, { useRef, useEffect, useState } from 'react';
import { init, dispose, Chart } from 'klinecharts';
import { CandleData } from '../data/sampleData';
import { 
  BollingerBandsSettings, 
  BollingerBandsStyleSettings,
  calculateBollingerBands
} from '../utils/bollingerBands';

interface CrosshairData {
  candle: CandleData;
  bollinger: {
    timestamp: number;
    basis: number;
    upper: number;
    lower: number;
  };
  dataIndex: number;
}

interface BollingerBandsChartProps {
  data: CandleData[];
  settings: BollingerBandsSettings;
  styleSettings: BollingerBandsStyleSettings;
  onCrosshairChange?: (data: CrosshairData | null) => void;
}

export const BollingerBandsChart: React.FC<BollingerBandsChartProps> = ({
  data,
  settings,
  styleSettings,
  onCrosshairChange
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<Chart | null>(null);

  // Format candle data for KLineCharts
  const formatCandleData = (candleData: CandleData[]) => {
    return candleData.map(candle => ({
      timestamp: candle.timestamp,
      open: Number(candle.open.toFixed(2)),
      high: Number(candle.high.toFixed(2)),
      low: Number(candle.low.toFixed(2)),
      close: Number(candle.close.toFixed(2)),
      volume: candle.volume
    }));
  };

  // Initialize chart
  useEffect(() => {
    if (chartRef.current && !chart) {
      const chartElement = chartRef.current;
      const kLineChart = init(chartElement);
      if (kLineChart) {
        setChart(kLineChart);
      }

      return () => {
        if (kLineChart) {
          dispose(chartElement);
        }
      };
    }
  }, [chart]);

  // Update data when it changes
  useEffect(() => {
    if (chart && data.length > 0) {
      const formattedData = formatCandleData(data);
      console.log('Applying data to chart:', formattedData.slice(0, 5)); // Debug log
      chart.applyNewData(formattedData);
    }
  }, [chart, data]);

  // Add Bollinger Bands using built-in indicator if available, or create custom overlay
  useEffect(() => {
    if (chart && data.length > 0) {
      console.log('Adding Bollinger Bands...'); // Debug
      
      try {
        // First, try to use the built-in Bollinger Bands indicator
        chart.removeIndicator('candle_pane', 'BOLL');
        const result = chart.createIndicator('BOLL', true, { 
          id: 'BOLL'
        });
        
        if (result) {
          console.log('Built-in BOLL indicator created:', result);
        } else {
          console.log('Built-in BOLL not available, trying custom approach...');
          
          // Calculate Bollinger Bands data
          const bollingerData = calculateBollingerBands(data, settings);
          console.log('Calculated BB data sample:', bollingerData.slice(-5));
          
          // Create overlay graphics directly
          chart.removeOverlay('bb_overlay');
          
          // Create custom overlay with lines
          const overlayData = data.map((candle, index) => {
            const bb = bollingerData[index];
            return {
              timestamp: candle.timestamp,
              points: [
                { timestamp: candle.timestamp, value: bb.upper },
                { timestamp: candle.timestamp, value: bb.basis },
                { timestamp: candle.timestamp, value: bb.lower }
              ]
            };
          }).filter(item => 
            !isNaN(item.points[0].value) && 
            !isNaN(item.points[1].value) && 
            !isNaN(item.points[2].value)
          );
          
          console.log('Overlay data prepared:', overlayData.length, 'points');
          
          // Add the overlay
          chart.createOverlay({
            name: 'bb_overlay',
            points: overlayData.flatMap(item => item.points),
            styles: {
              line: {
                color: styleSettings.basisColor,
                size: styleSettings.basisWidth
              }
            }
          });
        }
        
      } catch (error) {
        console.error('Error adding Bollinger Bands:', error);
      }
    }
  }, [chart, data, settings, styleSettings]);

  // Note: Crosshair functionality commented out due to KLineCharts API compatibility
  // Can be re-enabled once the correct action type is determined
  useEffect(() => {
    if (onCrosshairChange) {
      // Placeholder for crosshair functionality
      onCrosshairChange(null);
    }
  }, [onCrosshairChange]);

  return (
    <div 
      ref={chartRef} 
      className="w-full h-full min-h-[500px] border border-gray-200 rounded-lg"
      style={{ backgroundColor: '#ffffff' }}
    />
  );
};
