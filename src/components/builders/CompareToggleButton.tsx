'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  isInCompareList,
  toggleCompare,
  getCompareCount,
  COMPARE_LIMIT,
} from '@/lib/comparison-store';

interface CompareToggleButtonProps {
  builderId: string;
  className?: string;
}

/**
 * 工務店比較リストへの追加・削除トグル
 * 一覧カードや個別ページに置いて、最大3社までの shortlist を作る。
 */
export default function CompareToggleButton({ builderId, className = '' }: CompareToggleButtonProps) {
  const router = useRouter();
  const [inList, setInList] = useState(false);
  const [count, setCount] = useState(0);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    setInList(isInCompareList(builderId));
    setCount(getCompareCount());
    const handler = () => {
      setInList(isInCompareList(builderId));
      setCount(getCompareCount());
    };
    window.addEventListener('payhome:compare-changed', handler);
    return () => window.removeEventListener('payhome:compare-changed', handler);
  }, [builderId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleCompare(builderId);
    if (result === 'limit') {
      setHint(`比較リストは最大${COMPARE_LIMIT}社までです`);
      setTimeout(() => setHint(null), 2500);
      return;
    }
    if (result === 'added' && getCompareCount() >= 2) {
      // 2社以上揃ったら比較ページに案内
      setHint('比較リストに追加しました（→ 比較画面へ）');
      setTimeout(() => setHint(null), 2000);
    }
  };

  const handleViewCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/builders/compare');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-full border transition ${
          inList
            ? 'bg-[#E8740C] text-white border-[#E8740C]'
            : 'bg-white text-gray-600 border-gray-200 hover:border-[#E8740C] hover:text-[#E8740C]'
        }`}
        aria-label={inList ? '比較リストから外す' : '比較リストに追加'}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        {inList ? '比較中' : '比較に追加'}
      </button>

      {count > 0 && inList && (
        <button
          onClick={handleViewCompare}
          className="ml-2 text-[10px] text-[#E8740C] font-bold hover:underline"
        >
          ({count}社) 比較を見る →
        </button>
      )}

      {hint && (
        <div className="absolute top-full left-0 mt-1 z-10 bg-[#3D2200] text-white text-[10px] font-bold px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg">
          {hint}
        </div>
      )}
    </div>
  );
}
