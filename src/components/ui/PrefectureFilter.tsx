'use client';

const KYUSHU_PREFECTURES = [
  { value: 'all', label: 'すべて' },
  { value: '福岡県', label: '福岡' },
  { value: '佐賀県', label: '佐賀' },
  { value: '長崎県', label: '長崎' },
  { value: '熊本県', label: '熊本' },
  { value: '大分県', label: '大分' },
  { value: '宮崎県', label: '宮崎' },
  { value: '鹿児島県', label: '鹿児島' },
  { value: '沖縄県', label: '沖縄' },
  { value: 'オンライン', label: 'オンライン' },
] as const;

interface PrefectureFilterProps {
  value: string;
  onChange: (prefecture: string) => void;
  showOnline?: boolean;
}

export default function PrefectureFilter({ value, onChange, showOnline = false }: PrefectureFilterProps) {
  const items = showOnline
    ? KYUSHU_PREFECTURES
    : KYUSHU_PREFECTURES.filter(p => p.value !== 'オンライン');

  return (
    <div className="mb-6">
      <p className="text-xs font-bold text-gray-500 mb-2 tracking-wider">エリア</p>
      <div className="flex flex-wrap gap-2">
        {items.map((pref) => (
          <button
            key={pref.value}
            onClick={() => onChange(pref.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              value === pref.value
                ? 'bg-[#3D2200] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#3D2200] hover:text-[#3D2200]'
            }`}
          >
            {pref.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { KYUSHU_PREFECTURES };
