import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ConversionOptions } from './components/ConversionOptions';
import { ImagePreview } from './components/ImagePreview';
import { ConversionResults } from './components/ConversionResults';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
}

export interface ConvertedImage {
  id: string;
  originalFile: ImageFile;
  convertedBlob: Blob;
  downloadUrl: string;
  newFormat: string;
  quality: number;
  compressionRatio: number;
}

export interface ConversionSettings {
  format: 'jpeg' | 'png' | 'webp' | 'gif';
  quality: number;
}

function AppContent() {
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const [conversionSettings, setConversionSettings] = useState<ConversionSettings>({
    format: 'jpeg',
    quality: 80
  });
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleFilesUploaded = (files: ImageFile[]) => {
    setUploadedImages(files);
    setConvertedImages([]); // Clear previous results
  };

  const handleSettingsChange = (settings: ConversionSettings) => {
    setConversionSettings(settings);
  };

  const convertImages = async () => {
    if (uploadedImages.length === 0) return;

    setIsConverting(true);
    const results: ConvertedImage[] = [];

    for (const imageFile of uploadedImages) {
      try {
        const convertedBlob = await convertImage(imageFile.file, conversionSettings);
        const downloadUrl = URL.createObjectURL(convertedBlob);
        const compressionRatio = ((imageFile.size - convertedBlob.size) / imageFile.size) * 100;

        results.push({
          id: imageFile.id,
          originalFile: imageFile,
          convertedBlob,
          downloadUrl,
          newFormat: conversionSettings.format,
          quality: conversionSettings.quality,
          compressionRatio: Math.max(0, compressionRatio)
        });
      } catch (error) {
        console.error('Error converting image:', error);
      }
    }

    setConvertedImages(results);
    setIsConverting(false);
  };

  const convertImage = (file: File, settings: ConversionSettings): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          const mimeType = `image/${settings.format}`;
          const quality = settings.quality / 100;
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert image'));
              }
            },
            mimeType,
            quality
          );
        } else {
          reject(new Error('Canvas context not available'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleClearAll = () => {
    setUploadedImages([]);
    setConvertedImages([]);
    // Clean up object URLs
    convertedImages.forEach(img => {
      URL.revokeObjectURL(img.downloadUrl);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Upload Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              Upload Images
            </h2>
            <FileUpload onFilesUploaded={handleFilesUploaded} />
          </section>

          {/* Conversion Options */}
          {uploadedImages.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                Conversion Settings
              </h2>
              <ConversionOptions
                settings={conversionSettings}
                onSettingsChange={handleSettingsChange}
                onConvert={convertImages}
                isConverting={isConverting}
                hasImages={uploadedImages.length > 0}
              />
            </section>
          )}

          {/* Preview Section */}
          {uploadedImages.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                Preview
              </h2>
              <ImagePreview images={uploadedImages} />
            </section>
          )}

          {/* Results Section */}
          {convertedImages.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                Download Results
              </h2>
              <ConversionResults
                convertedImages={convertedImages}
                onClearAll={handleClearAll}
              />
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;