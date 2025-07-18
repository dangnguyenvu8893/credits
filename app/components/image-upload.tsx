'use client';

import { useState, useRef, useEffect } from 'react';

interface ImageUploadProps {
  onImageChange: (base64Image: string | null) => void;
  currentImage?: string | null;
  className?: string;
}

export default function ImageUpload({ onImageChange, currentImage, className = '' }: ImageUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview image when currentImage prop changes
  useEffect(() => {
    setPreviewImage(currentImage || null);
  }, [currentImage]);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Set canvas size to 120x120
        canvas.width = 120;
        canvas.height = 120;

        if (ctx) {
          // Clear canvas
          ctx.clearRect(0, 0, 120, 120);
          
          // Calculate scaling to maintain aspect ratio
          const scale = Math.min(120 / img.width, 120 / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          
          // Center the image
          const x = (120 - scaledWidth) / 2;
          const y = (120 - scaledHeight) / 2;
          
          // Draw the resized image
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
          
          // Convert to base64
          const base64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(base64);
        }
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      const resizedBase64 = await resizeImage(file);
      setPreviewImage(resizedBase64);
      onImageChange(resizedBase64);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Image
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragging
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {previewImage ? (
          <div className="relative">
            <img
              src={previewImage}
              alt="Profile preview"
              className="w-32 h-32 mx-auto rounded-full object-cover border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium text-green-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB (will be resized to 120x120)
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
} 