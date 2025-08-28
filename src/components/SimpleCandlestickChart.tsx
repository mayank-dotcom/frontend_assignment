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
      // Clear any existing chart
      dispose(chartRef.current);
      
      // Initialize chart with configuration
      const chart = init(chartRef.current, {
        grid: {
          show: true,
          horizontal: {
            show: true,
            color: '#E0E0E0'
          },
          vertical: {
            show: true,
            color: '#E0E0E0'
          }
        },
        candle: {
          margin: {
            top: 0.2,
            bottom: 0.1
          },
          type: 'candle_solid',
          bar: {
            upColor: '#26A69A',
            downColor: '#EF5350',
            noChangeColor: '#888888'
          },
          tooltip: {
            showRule: 'always',
            showType: 'standard'
          }
        },
        xAxis: {
          show: true
        },
        yAxis: {
          show: true,
          type: 'normal'
        }
      });
      
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
        if (chartRef.current) {
          dispose(chartRef.current);
        }
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
