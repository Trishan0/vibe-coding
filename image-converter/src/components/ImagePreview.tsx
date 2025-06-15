import React from 'react';
import { Eye, FileImage } from 'lucide-react';
import { ImageFile } from '../App';

interface ImagePreviewProps {
  images: ImageFile[];
}

export function ImagePreview({ images }: ImagePreviewProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
        <Eye className="w-5 h-5" />
        <span className="font-medium">Preview your images before conversion</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="aspect-square bg-gray-100 dark:bg-gray-600 relative overflow-hidden">
              <img
                src={image.preview}
                alt={image.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLDivElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full absolute inset-0 bg-gray-100 dark:bg-gray-600 items-center justify-center">
                <FileImage className="w-12 h-12 text-gray-400" />
              </div>
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 truncate" title={image.name}>
                {image.name}
              </h4>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{formatFileSize(image.size)}</span>
                <span className="capitalize bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                  {image.type.replace('image/', '')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}