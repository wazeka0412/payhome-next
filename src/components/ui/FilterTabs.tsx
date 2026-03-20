'use client';

import { useState } from 'react';

interface FilterTabsProps {
  tabs: string[];
  defaultActive?: number;
  onChange?: (tab: string, index: number) => void;
}

export default function FilterTabs({ tabs, defaultActive = 0, onChange }: FilterTabsProps) {
  const [active, setActive] = useState(defaultActive);

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => {
            setActive(i);
            onChange?.(tab, i);
          }}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            active === i
              ? 'bg-[#E8740C] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
