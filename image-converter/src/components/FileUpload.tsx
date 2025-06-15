import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, FileImage } from 'lucide-react';
import { ImageFile } from '../App';

interface FileUploadProps {
  onFilesUploaded: (files: ImageFile[]) => void;
}

export function FileUpload({ onFilesUploaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<ImageFile[]>([]);

  const processFiles = useCallback((fileList: FileList) => {
    const imageFiles: ImageFile[] = [];
    
    Array.from(fileList).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const id = Math.random().toString(36).substring(7);
        const preview = URL.createObjectURL(file);
        
        imageFiles.push({
          id,
          file,
          preview,
          name: file.name,
          size: file.size,
          type: file.type
        });
      }
    });

    if (imageFiles.length > 0) {
      setUploadedFiles(imageFiles);
      onFilesUploaded(imageFiles);
    }
  }, [onFilesUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== id);
    setUploadedFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
    
    // Clean up object URL
    const fileToRemove = uploadedFiles.find(file => file.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105'
            : uploadedFiles.length > 0
            ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-600'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-500 dark:hover:bg-blue-900/20'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors ${
            isDragging ? 'bg-blue-100 dark:bg-blue-800' : uploadedFiles.length > 0 ? 'bg-green-100 dark:bg-green-800' : 'bg-gray-100 dark:bg-gray-600'
          }`}>
            {uploadedFiles.length > 0 ? (
              <ImageIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            ) : (
              <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
            )}
          </div>
          
          {uploadedFiles.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                {uploadedFiles.length} image{uploadedFiles.length !== 1 ? 's' : ''} ready to convert
              </h3>
              <p className="text-green-600 dark:text-green-500">Add more images or proceed to conversion settings</p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {isDragging ? 'Drop your images here' : 'Drop images here or click to browse'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">Supports JPG, PNG, WebP, and GIF formats</p>
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-2">
            {['JPG', 'PNG', 'WebP', 'GIF'].map((format) => (
              <span
                key={format}
                className="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300"
              >
                {format}
              </span>
            ))}
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Uploaded Images:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="relative bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 group hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => removeFile(file.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileImage className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                      {file.type.replace('image/', '')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}