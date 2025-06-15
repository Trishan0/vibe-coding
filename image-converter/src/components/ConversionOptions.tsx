import React from 'react';
import { Settings, Play, Loader2 } from 'lucide-react';
import { ConversionSettings } from '../App';

interface ConversionOptionsProps {
  settings: ConversionSettings;
  onSettingsChange: (settings: ConversionSettings) => void;
  onConvert: () => void;
  isConverting: boolean;
  hasImages: boolean;
}

export function ConversionOptions({ 
  settings, 
  onSettingsChange, 
  onConvert, 
  isConverting, 
  hasImages 
}: ConversionOptionsProps) {
  const formatOptions = [
    { value: 'jpeg', label: 'JPEG', description: 'Best for photos with small file sizes' },
    { value: 'png', label: 'PNG', description: 'Best for graphics with transparency' },
    { value: 'webp', label: 'WebP', description: 'Modern format with excellent compression' },
    { value: 'gif', label: 'GIF', description: 'Best for simple animations and graphics' }
  ] as const;

  const handleFormatChange = (format: ConversionSettings['format']) => {
    onSettingsChange({ ...settings, format });
  };

  const handleQualityChange = (quality: number) => {
    onSettingsChange({ ...settings, quality });
  };

  return (
    <div className="space-y-8">
      {/* Format Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-500" />
          Output Format
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {formatOptions.map((option) => (
            <label
              key={option.value}
              className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
                settings.format === option.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-400 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-500'
              }`}
            >
              <input
                type="radio"
                name="format"
                value={option.value}
                checked={settings.format === option.value}
                onChange={(e) => handleFormatChange(e.target.value as ConversionSettings['format'])}
                className="sr-only"
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{option.label}</span>
                  {settings.format === option.value && (
                    <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Quality Settings */}
      {(settings.format === 'jpeg' || settings.format === 'webp') && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Quality Settings
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-medium text-gray-700 dark:text-gray-300">
                  Quality: {settings.quality}%
                </label>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {settings.quality >= 90 ? 'Excellent' : 
                   settings.quality >= 80 ? 'High' : 
                   settings.quality >= 60 ? 'Medium' : 'Low'}
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={settings.quality}
                  onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                  <span>Lower size</span>
                  <span>Higher quality</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Higher quality means better image clarity but larger file sizes.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Convert Button */}
      <div className="flex justify-center">
        <button
          onClick={onConvert}
          disabled={!hasImages || isConverting}
          className={`px-8 py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 ${
            !hasImages || isConverting
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
          }`}
        >
          {isConverting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Converting Images...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Convert Images
            </>
          )}
        </button>
      </div>
    </div>
  );
}