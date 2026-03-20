'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const INITIAL_FAVORITES = [
  {
    id: '1',
    title: '平屋 × 自然素材の家',
    price: '2,980万円',
    builder: '木の家工房',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    href: '/videos/1',
  },
  {
    id: '2',
    title: '吹き抜けリビングの家',
    price: '3,480万円',
    builder: 'デザインハウス',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    href: '/videos/2',
  },
  {
    id: '3',
    title: 'ガレージ付き二世帯住宅',
    price: '4,200万円',
    builder: 'ファミリーホーム',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    href: '/videos/3',
  },
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES)

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id))
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
        <div className="text-4xl mb-4">❤️</div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">お気に入りはまだありません</h2>
        <p className="text-sm text-gray-500 mb-6">気になる物件を見つけたら、ハートボタンで保存しましょう。</p>
        <Link href="/videos"
          className="inline-block bg-[#E8740C] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#D4660A] transition">
          物件を探す
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-900">お気に入り物件（{favorites.length}件）</h1>
      {favorites.map(item => (
        <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="relative aspect-video">
            <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-900">{item.title}</h3>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <span className="text-[#E8740C] font-bold">{item.price}</span>
              <span>{item.builder}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Link href={item.href}
                className="flex-1 text-center bg-[#E8740C] text-white py-2 rounded-full text-sm font-bold hover:bg-[#D4660A] transition">
                物件詳細を見る
              </Link>
              <button
                onClick={() => removeFavorite(item.id)}
                className="px-4 py-2 rounded-full text-sm text-gray-500 border border-gray-200 hover:border-red-300 hover:text-red-500 transition">
                お気に入りから削除
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
