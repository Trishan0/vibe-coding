import React from 'react';
import { Heart, Shield, Zap, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Privacy First
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All conversions happen in your browser. Your images never leave your device.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              Lightning Fast
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Client-side processing means instant results without waiting for uploads.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-500" />
              Universal Support
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Convert between JPG, PNG, WebP, and GIF formats with customizable quality.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Formats Supported</h3>
            <div className="flex flex-wrap gap-2">
              {['JPG', 'PNG', 'WebP', 'GIF'].map((format) => (
                <span
                  key={format}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for image conversion
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            © 2025 ImageConverter Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}