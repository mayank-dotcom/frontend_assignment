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

  // Initialize chart - fixed version
  useEffect(() => {
    if (chartRef.current && !chart) {
      console.log('Initializing chart...');
      const chartElement = chartRef.current;
      
      // Clear any existing content
      chartElement.innerHTML = '';
      
      // Ensure the element has dimensions
      const dimensions = {
        width: chartElement.offsetWidth,
        height: chartElement.offsetHeight,
        clientWidth: chartElement.clientWidth,
        clientHeight: chartElement.clientHeight
      };
      console.log('Chart element dimensions:', dimensions);
      console.log('Width:', dimensions.width, 'Height:', dimensions.height);
      
      // Initialize chart with minimal configuration - same as working test chart
      const kLineChart = init(chartElement);
      
      if (kLineChart) {
        console.log('Chart initialized successfully');
        setChart(kLineChart);
        
        // Check what's inside the chart container after a delay
        setTimeout(() => {
          console.log('Chart container children:', chartElement.children.length);
          for (let i = 0; i < chartElement.children.length; i++) {
            const child = chartElement.children[i] as HTMLElement;
            console.log(`Child ${i}:`, child.tagName, child.className, {
              width: child.offsetWidth,
              height: child.offsetHeight,
              style: child.getAttribute('style')
            });
          }
          
          kLineChart.resize();
          console.log('Chart resized');
        }, 100);
      } else {
        console.error('Failed to initialize chart');
      }

      return () => {
        if (kLineChart) {
          dispose(chartElement);
        }
      };
    }
  }, []); // Remove chart dependency to prevent recreation

  // Update data when it changes
  useEffect(() => {
    if (chart && data.length > 0) {
      const formattedData = formatCandleData(data);
      console.log('Applying data to chart:', formattedData.slice(0, 5)); // Debug log
      console.log('Formatted data length:', formattedData.length);
      
      try {
        chart.applyNewData(formattedData);
        console.log('Data applied successfully');
        
        // Force a redraw
        setTimeout(() => {
          chart.resize();
          console.log('Chart resized after data application');
          
          // Check if chart has rendered content
          setTimeout(() => {
            console.log('Final check - Chart container children:', chartRef.current?.children.length || 0);
          }, 200);
        }, 100);
      } catch (error) {
        console.error('Error applying data:', error);
      }
    }
  }, [chart, data]);

  // Add Bollinger Bands indicator after chart is working
  useEffect(() => {
    if (chart && data.length > 0) {
      console.log('Chart should now show candlesticks.');
      
      // Add Bollinger Bands after ensuring chart is rendered
      setTimeout(() => {
        if (chartRef.current?.children.length && chartRef.current.children.length > 0) {
          console.log('Chart has rendered content, adding Bollinger Bands...');
          try {
            // Try the simplest Bollinger Bands approach
            chart.createIndicator('BOLL', false, { id: 'main' });
            console.log('Bollinger Bands added successfully');
          } catch (error) {
            console.log('Bollinger Bands failed, but chart should still work:', error);
          }
        } else {
          console.log('Chart container still empty, skipping Bollinger Bands');
        }
      }, 1000);
    }
  }, [chart, data]);

  // Note: Crosshair functionality commented out due to KLineCharts API compatibility
  // Can be re-enabled once the correct action type is determined
  useEffect(() => {
    if (onCrosshairChange) {
      // Placeholder for crosshair functionality
      onCrosshairChange(null);
    }
  }, [onCrosshairChange]);

  return (
    <div className="relative w-full h-[500px] bg-white">
      <div 
        ref={chartRef} 
        className="w-full h-full border border-gray-300 rounded-lg"
        style={{ 
          backgroundColor: '#ffffff',
          width: '100%',
          height: '500px',
          position: 'relative',
          display: 'block',
          minHeight: '500px',
          overflow: 'hidden'
        }}
      />
      {!chart && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-600">Loading chart...</p>
        </div>
      )}
    </div>
  );
};
