'use client';

import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { 
  BollingerBandsSettings, 
  BollingerBandsStyleSettings,
  defaultBollingerBandsSettings,
  defaultBollingerBandsStyleSettings
} from '../utils/bollingerBands';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BollingerBandsSettings;
  styleSettings: BollingerBandsStyleSettings;
  onSettingsChange: (settings: BollingerBandsSettings) => void;
  onStyleSettingsChange: (styleSettings: BollingerBandsStyleSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  styleSettings,
  onSettingsChange,
  onStyleSettingsChange
}) => {
  const [activeTab, setActiveTab] = useState<'inputs' | 'style'>('inputs');

  if (!isOpen) return null;

  const handleInputChange = (key: keyof BollingerBandsSettings, value: string | number) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const handleStyleChange = (key: keyof BollingerBandsStyleSettings, value: string | number | boolean) => {
    onStyleSettingsChange({
      ...styleSettings,
      [key]: value
    });
  };

  const resetToDefaults = () => {
    if (activeTab === 'inputs') {
      onSettingsChange(defaultBollingerBandsSettings);
    } else {
      onStyleSettingsChange(defaultBollingerBandsStyleSettings);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Bollinger Bands Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('inputs')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'inputs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Inputs
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'style'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Style
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {activeTab === 'inputs' && (
            <div className="space-y-4">
              {/* Length */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Length
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={settings.length}
                  onChange={(e) => handleInputChange('length', parseInt(e.target.value) || 20)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* MA Type */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  MA Type
                </label>
                <select
                  value={settings.maType}
                  onChange={(e) => handleInputChange('maType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SMA">SMA (Simple Moving Average)</option>
                </select>
              </div>

              {/* StdDev Multiplier */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  StdDev Multiplier
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={settings.stdDevMultiplier}
                  onChange={(e) => handleInputChange('stdDevMultiplier', parseFloat(e.target.value) || 2)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Source
                </label>
                <select
                  value={settings.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="close">Close</option>
                  <option value="open">Open</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Offset */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Offset
                </label>
                <input
                  type="number"
                  min="-100"
                  max="100"
                  value={settings.offset}
                  onChange={(e) => handleInputChange('offset', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-4">
              {/* Basis Line */}
              <div className="border rounded-lg p-3">
                <h3 className="font-medium text-black mb-2">Basis Line</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-black">
                    <input
                      type="checkbox"
                      checked={styleSettings.basisVisible}
                      onChange={(e) => handleStyleChange('basisVisible', e.target.checked)}
                      className="mr-2"
                    />
                    Visible
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={styleSettings.basisColor}
                      onChange={(e) => handleStyleChange('basisColor', e.target.value)}
                      className="w-8 h-8 border rounded"
                    />
                    <select
                      value={styleSettings.basisStyle}
                      onChange={(e) => handleStyleChange('basisStyle', e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm text-black"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-black mb-1">
                      Line Width: {styleSettings.basisWidth}px
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={styleSettings.basisWidth}
                      onChange={(e) => handleStyleChange('basisWidth', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Upper Band */}
              <div className="border rounded-lg p-3">
                <h3 className="font-medium text-black mb-2">Upper Band</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-black">
                    <input
                      type="checkbox"
                      checked={styleSettings.upperVisible}
                      onChange={(e) => handleStyleChange('upperVisible', e.target.checked)}
                      className="mr-2"
                    />
                    Visible
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={styleSettings.upperColor}
                      onChange={(e) => handleStyleChange('upperColor', e.target.value)}
                      className="w-8 h-8 border rounded"
                    />
                    <select
                      value={styleSettings.upperStyle}
                      onChange={(e) => handleStyleChange('upperStyle', e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm text-black"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-black mb-1">
                      Line Width: {styleSettings.upperWidth}px
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={styleSettings.upperWidth}
                      onChange={(e) => handleStyleChange('upperWidth', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Lower Band */}
              <div className="border rounded-lg p-3">
                <h3 className="font-medium text-black mb-2">Lower Band</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-black">
                    <input
                      type="checkbox"
                      checked={styleSettings.lowerVisible}
                      onChange={(e) => handleStyleChange('lowerVisible', e.target.checked)}
                      className="mr-2"
                    />
                    Visible
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={styleSettings.lowerColor}
                      onChange={(e) => handleStyleChange('lowerColor', e.target.value)}
                      className="w-8 h-8 border rounded"
                    />
                    <select
                      value={styleSettings.lowerStyle}
                      onChange={(e) => handleStyleChange('lowerStyle', e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm text-black"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-black mb-1">
                      Line Width: {styleSettings.lowerWidth}px
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={styleSettings.lowerWidth}
                      onChange={(e) => handleStyleChange('lowerWidth', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Background Fill */}
              <div className="border rounded-lg p-3">
                <h3 className="font-medium text-black mb-2">Background Fill</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-black">
                    <input
                      type="checkbox"
                      checked={styleSettings.fillVisible}
                      onChange={(e) => handleStyleChange('fillVisible', e.target.checked)}
                      className="mr-2"
                    />
                    Fill Background
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={styleSettings.fillColor}
                      onChange={(e) => handleStyleChange('fillColor', e.target.value)}
                      className="w-8 h-8 border rounded"
                    />
                    <div className="flex-1">
                      <label className="block text-xs text-black mb-1">
                        Opacity: {Math.round(styleSettings.fillOpacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={styleSettings.fillOpacity}
                        onChange={(e) => handleStyleChange('fillOpacity', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Reset to Defaults
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
