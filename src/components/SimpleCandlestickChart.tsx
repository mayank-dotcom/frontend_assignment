'use client';

import React, { useRef, useEffect } from 'react';
import { init, dispose } from 'klinecharts';
import { CandleData } from '../data/sampleData';

interface SimpleCandlestickChartProps {
  data: CandleData[];
}

export const SimpleCandlestickChart: React.FC<SimpleCandlestickChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartElement = chartRef.current;
      // Clear any existing chart
      dispose(chartElement);
      
      // Initialize chart with basic configuration
      const chart = init(chartElement);
      
      if (chart && data.length > 0) {
        // Format data for KLineCharts - ensure proper format
        const formattedData = data.map(candle => {
          const candleData = {
            timestamp: candle.timestamp,
            open: Number(candle.open),
            high: Number(candle.high),
            low: Number(candle.low),
            close: Number(candle.close),
            volume: Number(candle.volume)
          };
          return candleData;
        });

        console.log('Chart initialized, applying data:', formattedData.length, 'candles');
        console.log('Sample candle:', formattedData[0]);
        console.log('Date range:', new Date(formattedData[0].timestamp), 'to', new Date(formattedData[formattedData.length-1].timestamp));
        
        // Apply data to chart
        try {
          chart.applyNewData(formattedData);
          console.log('Data applied successfully');
        } catch (error) {
          console.error('Error applying data:', error);
        }
      }

      return () => {
        dispose(chartElement);
      };
    }
  }, [data]);

  return (
    <div 
      ref={chartRef} 
      className="w-full h-full min-h-[500px] border border-gray-200 rounded-lg bg-white"
    />
  );
};
