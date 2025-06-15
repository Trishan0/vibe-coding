import React from 'react';
import { Download, Trash2, CheckCircle, ArrowRight } from 'lucide-react';
import { ConvertedImage } from '../App';

interface ConversionResultsProps {
  convertedImages: ConvertedImage[];
  onClearAll: () => void;
}

export function ConversionResults({ convertedImages, onClearAll }: ConversionResultsProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadImage = (convertedImage: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = convertedImage.downloadUrl;
    link.download = `${convertedImage.originalFile.name.split('.')[0]}.${convertedImage.newFormat === 'jpeg' ? 'jpg' : convertedImage.newFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    convertedImages.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 100);
    });
  };

  const totalOriginalSize = convertedImages.reduce((sum, img) => sum + img.originalFile.size, 0);
  const totalConvertedSize = convertedImages.reduce((sum, img) => sum + img.convertedBlob.size, 0);
  const totalCompressionRatio = ((totalOriginalSize - totalConvertedSize) / totalOriginalSize) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
            Conversion Complete!
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {convertedImages.length}
            </div>
            <div className="text-sm text-green-600 dark:text-green-500">Images Converted</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {Math.max(0, totalCompressionRatio).toFixed(1)}%
            </div>
            <div className="text-sm text-green-600 dark:text-green-500">Size Reduction</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatFileSize(totalOriginalSize - totalConvertedSize)}
            </div>
            <div className="text-sm text-green-600 dark:text-green-500">Space Saved</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <button
          onClick={downloadAll}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          <Download className="w-5 h-5" />
          Download All Images
        </button>
        
        <button
          onClick={onClearAll}
          className="px-6 py-3 bg-gray-500 dark:bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Clear All
        </button>
      </div>

      {/* Individual Results */}
      <div className="space-y-4">
        {convertedImages.map((convertedImage) => (
          <div
            key={convertedImage.id}
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {convertedImage.originalFile.name}
                </h4>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Original:</span>
                    <span>{formatFileSize(convertedImage.originalFile.size)}</span>
                    <span className="capitalize bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                      {convertedImage.originalFile.type.replace('image/', '')}
                    </span>
                  </div>
                  
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Converted:</span>
                    <span>{formatFileSize(convertedImage.convertedBlob.size)}</span>
                    <span className="capitalize bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                      {convertedImage.newFormat === 'jpeg' ? 'jpg' : convertedImage.newFormat}
                    </span>
                  </div>
                </div>
                
                {convertedImage.compressionRatio > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {convertedImage.compressionRatio.toFixed(1)}% smaller
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 max-w-32">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(convertedImage.compressionRatio, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => downloadImage(convertedImage)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 self-start lg:self-center"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}