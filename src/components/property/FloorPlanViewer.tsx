'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

/**
 * 間取り図ビューア（v4.0 会員限定機能）
 *
 * - 非会員：低解像度のサムネイル + 会員登録CTAのオーバーレイ
 * - 会員：フル解像度の SVG 間取り図 + ズーム / フルスクリーン操作
 *
 * 実装済み物件には properties.ts の `floorPlan` フィールドが必要。
 * v4.0 では SVG プレースホルダで「間取り図のレイアウト」を生成し、
 * 後日 PNG / 実際の図面に差し替え可能な形にしている。
 */

interface FloorPlanViewerProps {
  propertyId: string;
  layout: string; // 例: "3LDK"
  area: string; // 例: "25坪（82.6㎡）"
}

export default function FloorPlanViewer({ propertyId, layout, area }: FloorPlanViewerProps) {
  const { status } = useSession();
  const [zoomed, setZoomed] = useState(false);
  const isMember = status === 'authenticated';

  return (
    <div className="mb-8">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-lg font-bold text-[#3D2200]">間取り図</h2>
        <span className="text-xs text-gray-500">{layout} / {area}</span>
      </div>

      <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* 間取り図 SVG */}
        <div
          className={`relative aspect-[4/3] transition-all duration-300 ${
            isMember ? '' : 'blur-md scale-105'
          }`}
        >
          <FloorPlanSvg propertyId={propertyId} layout={layout} />
        </div>

        {/* 非会員向けロックオーバーレイ */}
        {!isMember && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white/80 via-white/70 to-white/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E8740C]/20 p-6 md:p-8 max-w-sm mx-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#FFF8F0] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#E8740C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#3D2200] mb-2">
                会員限定コンテンツ
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-5">
                間取り図のフル解像度版は、無料会員登録でご覧いただけます。
                詳細な寸法・収納配置・採光まで確認できます。
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/signup?redirect=/property/${propertyId}`}
                  className="bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-6 py-2.5 rounded-full text-sm transition shadow-md"
                >
                  無料会員登録して見る
                </Link>
                <Link
                  href={`/login?redirect=/property/${propertyId}`}
                  className="text-xs text-gray-500 hover:text-[#E8740C] transition"
                >
                  すでに会員の方はログイン →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 会員向け：ズームトグル */}
        {isMember && (
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => setZoomed((v) => !v)}
              className="bg-white/95 hover:bg-white shadow-md border border-gray-200 rounded-full p-2 transition"
              aria-label={zoomed ? '通常表示に戻す' : '拡大表示'}
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {zoomed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13H5" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                )}
              </svg>
            </button>
            <span className="bg-[#E8740C] text-white text-[10px] font-bold px-2.5 py-1 rounded-full self-center">
              FULL HD
            </span>
          </div>
        )}
      </div>

      {/* 会員向けズームモーダル */}
      {isMember && zoomed && (
        <div
          onClick={() => setZoomed(false)}
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden">
            <div className="aspect-[4/3]">
              <FloorPlanSvg propertyId={propertyId} layout={layout} />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomed(false);
              }}
              className="absolute top-4 right-4 bg-white/95 rounded-full p-2 shadow-md"
              aria-label="閉じる"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {isMember && (
        <p className="text-[10px] text-gray-400 mt-2">
          会員限定機能：フル解像度の間取り図をご覧いただいています
        </p>
      )}
    </div>
  );
}

/**
 * SVG で間取り図のプレースホルダーを生成。
 * 物件ごとに異なるシード（propertyId）でバリエーションを出す。
 * 後日、本物の図面PNGに差し替え可能。
 */
function FloorPlanSvg({ propertyId, layout }: { propertyId: string; layout: string }) {
  // propertyId をシードに使ったバリエーション
  const seed = propertyId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const isThreeBR = layout.includes('3');
  const isFourBR = layout.includes('4');

  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* 背景 */}
      <rect width="400" height="300" fill="#FAFAF7" />

      {/* グリッド */}
      <defs>
        <pattern id={`grid-${propertyId}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E5E0" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#grid-${propertyId})`} />

      {/* 外壁 */}
      <rect x="40" y="40" width="320" height="220" fill="#FFFFFF" stroke="#3D2200" strokeWidth="3" />

      {/* リビング */}
      <rect x="40" y="40" width="180" height="140" fill="#FFF8F0" stroke="#3D2200" strokeWidth="1.5" />
      <text x="130" y="105" textAnchor="middle" fontSize="12" fill="#3D2200" fontWeight="bold">
        LDK
      </text>
      <text x="130" y="120" textAnchor="middle" fontSize="9" fill="#999">
        {16 + (seed % 4)}帖
      </text>

      {/* キッチン */}
      <rect x="40" y="180" width="100" height="80" fill="#F0F8FF" stroke="#3D2200" strokeWidth="1.5" />
      <text x="90" y="220" textAnchor="middle" fontSize="11" fill="#3D2200" fontWeight="bold">
        Kitchen
      </text>

      {/* 寝室1 */}
      <rect x="220" y="40" width="140" height="100" fill="#F0FFF0" stroke="#3D2200" strokeWidth="1.5" />
      <text x="290" y="85" textAnchor="middle" fontSize="11" fill="#3D2200" fontWeight="bold">
        主寝室
      </text>
      <text x="290" y="100" textAnchor="middle" fontSize="9" fill="#999">
        {6 + (seed % 3)}帖
      </text>

      {/* 寝室2 */}
      {(isThreeBR || isFourBR) && (
        <>
          <rect x="220" y="140" width="70" height="100" fill="#F5F0FF" stroke="#3D2200" strokeWidth="1.5" />
          <text x="255" y="185" textAnchor="middle" fontSize="10" fill="#3D2200" fontWeight="bold">
            洋室
          </text>
          <text x="255" y="200" textAnchor="middle" fontSize="9" fill="#999">
            {4 + (seed % 3)}帖
          </text>
        </>
      )}

      {/* 寝室3 */}
      {isFourBR && (
        <>
          <rect x="290" y="140" width="70" height="100" fill="#FFF0F0" stroke="#3D2200" strokeWidth="1.5" />
          <text x="325" y="185" textAnchor="middle" fontSize="10" fill="#3D2200" fontWeight="bold">
            洋室
          </text>
          <text x="325" y="200" textAnchor="middle" fontSize="9" fill="#999">
            {4 + (seed % 3)}帖
          </text>
        </>
      )}

      {/* 浴室 */}
      <rect x="140" y="180" width="60" height="40" fill="#E0F0FF" stroke="#3D2200" strokeWidth="1.5" />
      <text x="170" y="205" textAnchor="middle" fontSize="9" fill="#3D2200">浴室</text>

      {/* 洗面 */}
      <rect x="140" y="220" width="60" height="40" fill="#E0F0FF" stroke="#3D2200" strokeWidth="1.5" />
      <text x="170" y="245" textAnchor="middle" fontSize="9" fill="#3D2200">洗面</text>

      {/* トイレ */}
      <rect x="200" y="220" width="20" height="40" fill="#FFFAF0" stroke="#3D2200" strokeWidth="1.5" />

      {/* 玄関 */}
      <rect x="40" y="260" width="80" height="20" fill="#FAFAF0" stroke="#3D2200" strokeWidth="1.5" />
      <text x="80" y="275" textAnchor="middle" fontSize="9" fill="#3D2200">玄関</text>

      {/* 方位記号 */}
      <g transform="translate(360, 60)">
        <circle r="14" fill="white" stroke="#3D2200" strokeWidth="1" />
        <text textAnchor="middle" y="-2" fontSize="10" fill="#3D2200" fontWeight="bold">N</text>
        <path d="M 0 -10 L -3 0 L 0 -3 L 3 0 Z" fill="#E8740C" />
      </g>

      {/* スケール */}
      <text x="200" y="295" textAnchor="middle" fontSize="8" fill="#999">
        SCALE 1:100 ・ {layout} ・ ぺいほーむ会員限定図面
      </text>
    </svg>
  );
}
