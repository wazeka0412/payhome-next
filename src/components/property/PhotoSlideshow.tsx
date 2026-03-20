'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PhotoSlideshow({ photos, title }: { photos: string[]; title: string }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? photos.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === photos.length - 1 ? 0 : c + 1));

  if (photos.length === 0) return null;

  return (
    <div>
      {/* Main slide */}
      <div className="relative aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden mb-3">
        <Image
          src={photos[current]}
          alt={`${title} 写真${current + 1}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2-2H10L8 7H5a2 2 0 00-2 2z" />
            <circle cx="12" cy="13" r="3" strokeWidth={1} />
          </svg>
        </div>

        {/* Navigation arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#3D2200] hover:bg-white transition shadow-md cursor-pointer"
              aria-label="前の写真"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#3D2200] hover:bg-white transition shadow-md cursor-pointer"
              aria-label="次の写真"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
          {current + 1} / {photos.length}
        </div>
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all ${
                i === current
                  ? 'ring-2 ring-[#E8740C] opacity-100'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <Image
                src={photo}
                alt={`${title} サムネイル${i + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2-2H10L8 7H5a2 2 0 00-2 2z" />
                  <circle cx="12" cy="13" r="3" strokeWidth={1} />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
