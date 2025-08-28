'use client';

import React from 'react';
import { CandleData } from '../data/sampleData';
import { BollingerBandsData } from '../utils/bollingerBands';

interface TooltipProps {
  candle?: CandleData;
  bollinger?: BollingerBandsData;
  dataIndex?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ candle, bollinger, dataIndex }) => {
  if (!candle || !bollinger) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[250px]">
        <p className="text-gray-500 text-sm">Hover over the chart to see values</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return (volume / 1000000).toFixed(1) + 'M';
    } else if (volume >= 1000) {
      return (volume / 1000).toFixed(1) + 'K';
    }
    return volume.toString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[250px]">
      {/* Date */}
      <div className="mb-3 pb-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-800">
          {formatDate(candle.timestamp)}
        </p>
      </div>

      {/* OHLCV Data */}
      <div className="space-y-1 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Open:</span>
          <span className="text-sm font-medium">${formatPrice(candle.open)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">High:</span>
          <span className="text-sm font-medium text-green-600">${formatPrice(candle.high)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Low:</span>
          <span className="text-sm font-medium text-red-600">${formatPrice(candle.low)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Close:</span>
          <span className={`text-sm font-medium ${
            candle.close >= candle.open ? 'text-green-600' : 'text-red-600'
          }`}>
            ${formatPrice(candle.close)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Volume:</span>
          <span className="text-sm font-medium">{formatVolume(candle.volume)}</span>
        </div>
      </div>

      {/* Bollinger Bands Data */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-800 mb-2">Bollinger Bands</p>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Upper:</span>
            <span className="text-sm font-medium text-blue-600">
              {isNaN(bollinger.upper) ? 'N/A' : `$${formatPrice(bollinger.upper)}`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Basis:</span>
            <span className="text-sm font-medium text-orange-600">
              {isNaN(bollinger.basis) ? 'N/A' : `$${formatPrice(bollinger.basis)}`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Lower:</span>
            <span className="text-sm font-medium text-blue-600">
              {isNaN(bollinger.lower) ? 'N/A' : `$${formatPrice(bollinger.lower)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
