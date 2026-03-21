'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
}

export default function ImageUploader({ label, images, onChange, multiple = true }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        newImages.push(dataUrl);
        if (newImages.length === files.length) {
          if (multiple) {
            onChange([...images, ...newImages]);
          } else {
            onChange([newImages[0]]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const newImages = [...images];
    const target = index + direction;
    if (target < 0 || target >= newImages.length) return;
    [newImages[index], newImages[target]] = [newImages[target], newImages[index]];
    onChange(newImages);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
          dragOver ? 'border-[#E8740C] bg-[#E8740C]/5' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="text-gray-400 text-sm">
          <span className="text-lg block mb-1">+</span>
          クリックまたはドラッグ&ドロップで画像を追加
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          aria-label="画像をアップロード"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {images.map((src, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
              <div className="aspect-square relative">
                {src.startsWith('data:') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={`写真 ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <Image src={src} alt={`写真 ${i + 1}`} fill className="object-cover" sizes="120px" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                {multiple && i > 0 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleMove(i, -1); }}
                    className="w-6 h-6 bg-white/90 rounded text-xs font-bold text-gray-700 hover:bg-white cursor-pointer"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(i); }}
                  className="w-6 h-6 bg-red-500 rounded text-xs font-bold text-white hover:bg-red-600 cursor-pointer"
                >
                  ×
                </button>
                {multiple && i < images.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleMove(i, 1); }}
                    className="w-6 h-6 bg-white/90 rounded text-xs font-bold text-gray-700 hover:bg-white cursor-pointer"
                  >
                    →
                  </button>
                )}
              </div>
              <div className="absolute top-1 left-1 bg-black/60 text-white text-[0.6rem] px-1.5 py-0.5 rounded">
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
