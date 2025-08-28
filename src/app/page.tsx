'use client';

import React, { useState } from 'react';
import { Settings, TrendingUp } from 'lucide-react';
import { BollingerBandsChart } from '../components/BollingerBandsChart';
import { SettingsModal } from '../components/SettingsModal';
import { Tooltip } from '../components/Tooltip';
import { sampleData } from '../data/sampleData';
import { 
  BollingerBandsSettings, 
  BollingerBandsStyleSettings,
  defaultBollingerBandsSettings,
  defaultBollingerBandsStyleSettings
} from '../utils/bollingerBands';

export default function Home() {
  const [settings, setSettings] = useState<BollingerBandsSettings>(defaultBollingerBandsSettings);
  const [styleSettings, setStyleSettings] = useState<BollingerBandsStyleSettings>(defaultBollingerBandsStyleSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [crosshairData, setCrosshairData] = useState<any>(null);
  const [indicatorAdded, setIndicatorAdded] = useState(false);

  // Debug: Log sample data
  React.useEffect(() => {
    console.log('Sample data length:', sampleData.length);
    console.log('First 3 candles:', sampleData.slice(0, 3));
  }, []);

  const handleAddIndicator = () => {
    setIndicatorAdded(true);
  };

  const handleRemoveIndicator = () => {
    setIndicatorAdded(false);
    setCrosshairData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bollinger Bands Chart</h1>
              <p className="text-sm text-gray-600">Advanced technical analysis with KLineCharts</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!indicatorAdded ? (
              <button
                onClick={handleAddIndicator}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Add Bollinger Bands
              </button>
            ) : (
              <>
                <button
                  onClick={handleRemoveIndicator}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Remove Indicator
                </button>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Price Chart</h2>
                <p className="text-sm text-gray-600">
                  {indicatorAdded ? 'Candlestick chart with Bollinger Bands indicator' : 'Click "Add Bollinger Bands" to enable the indicator'}
                </p>
              </div>
              
              {indicatorAdded ? (
                <BollingerBandsChart 
                  data={sampleData}
                  settings={settings}
                  styleSettings={styleSettings}
                  onCrosshairChange={setCrosshairData}
                />
              ) : (
                <div className="w-full h-[500px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">Chart Ready</p>
                    <p className="text-gray-400 text-sm">Add Bollinger Bands to see the indicator</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Data</h3>
              <Tooltip 
                candle={crosshairData?.candle}
                bollinger={crosshairData?.bollinger}
                dataIndex={crosshairData?.dataIndex}
              />
            </div>

            {/* Indicator Info */}
            {indicatorAdded && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicator Settings</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Length:</span>
                    <span className="font-medium">{settings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">MA Type:</span>
                    <span className="font-medium">{settings.maType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Multiplier:</span>
                    <span className="font-medium">{settings.stdDevMultiplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Source:</span>
                    <span className="font-medium capitalize">{settings.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Offset:</span>
                    <span className="font-medium">{settings.offset}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Customize Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        styleSettings={styleSettings}
        onSettingsChange={setSettings}
        onStyleSettingsChange={setStyleSettings}
      />
    </div>
  );
}
