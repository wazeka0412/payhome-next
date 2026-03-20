'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { LINE_URL } from '@/lib/constants';

export default function SimulatorPage() {
  const [amount, setAmount] = useState(3000); // 万円
  const [years, setYears] = useState(35);
  const [rate, setRate] = useState(0.5);
  const [bonus, setBonus] = useState(0); // 万円

  const result = useMemo(() => {
    const principal = (amount - bonus * years * 2) * 10000; // 年2回のボーナスを差し引き
    const monthlyRate = rate / 100 / 12;
    const totalMonths = years * 12;

    if (monthlyRate === 0) {
      return {
        monthly: Math.round(principal / totalMonths),
        bonusPayment: bonus * 10000,
        totalPayment: amount * 10000,
        totalInterest: 0,
      };
    }

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const bonusPayment = bonus * 10000;
    const totalPayment = Math.round(monthlyPayment * totalMonths + bonusPayment * years * 2);
    const totalInterest = totalPayment - amount * 10000;

    return {
      monthly: Math.round(monthlyPayment),
      bonusPayment,
      totalPayment,
      totalInterest,
    };
  }, [amount, years, rate, bonus]);

  const formatYen = (yen: number) => {
    if (yen >= 10000) {
      return `${(yen / 10000).toFixed(yen % 10000 === 0 ? 0 : 1)}万円`;
    }
    return `${yen.toLocaleString()}円`;
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#E8740C] via-[#F5A623] to-[#fdba74] text-white pt-16 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <nav className="text-sm opacity-85 mb-4">
            <Link href="/" className="hover:underline">ホーム</Link>
            <span className="mx-1">&gt;</span>
            <span>ローンシミュレーター</span>
          </nav>
          <p className="text-xs font-semibold tracking-widest uppercase opacity-80 mb-2">
            LOAN SIMULATOR
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">住宅ローンシミュレーター</h1>
          <p className="text-sm opacity-90 leading-relaxed">
            借入金額・返済期間・金利を入力して、月々の返済額をかんたんシミュレーション。
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 -mt-8 pb-16 relative z-10">
        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-lg font-bold text-[#3D2200] mb-6">条件を入力</h2>

          {/* Amount Slider */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">借入金額</label>
            <div className="text-center text-2xl font-extrabold text-[#E8740C] font-mono mb-2">
              {amount.toLocaleString()}万円
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#E8740C]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>500万円</span>
              <span>1億円</span>
            </div>
          </div>

          {/* Years Select */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">返済期間</label>
            <div className="text-center text-2xl font-extrabold text-[#E8740C] font-mono mb-2">
              {years}年
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#E8740C]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5年</span>
              <span>50年</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">金利（年利）</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={10}
                step={0.01}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-lg font-bold text-center text-[#E8740C] focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
              />
              <span className="text-sm font-bold text-gray-500">%</span>
            </div>
          </div>

          {/* Bonus */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">ボーナス返済（1回あたり）</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={200}
                step={1}
                value={bonus}
                onChange={(e) => setBonus(Number(e.target.value))}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-lg font-bold text-center text-[#E8740C] focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
              />
              <span className="text-sm font-bold text-gray-500">万円</span>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-lg font-bold text-[#3D2200] mb-6">シミュレーション結果</h2>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-1">毎月の返済額</p>
            <div className="text-4xl md:text-5xl font-extrabold text-[#E8740C] font-mono">
              {result.monthly.toLocaleString()}
              <span className="text-lg font-normal text-gray-500 ml-1">円</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FFF8F0] rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">ボーナス返済額</p>
              <p className="text-lg font-bold text-[#3D2200]">{formatYen(result.bonusPayment)}</p>
            </div>
            <div className="bg-[#FFF8F0] rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">総返済額</p>
              <p className="text-lg font-bold text-[#3D2200]">{formatYen(result.totalPayment)}</p>
            </div>
            <div className="bg-[#FFF8F0] rounded-xl p-4 text-center col-span-2">
              <p className="text-xs text-gray-500 mb-1">総利息額</p>
              <p className="text-lg font-bold text-[#3D2200]">{formatYen(result.totalInterest)}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#E8740C] to-[#F5A623] rounded-2xl p-6 md:p-8 text-center text-white">
          <h3 className="text-lg font-bold mb-2">予算に合った家づくり、相談してみませんか？</h3>
          <p className="text-sm opacity-90 mb-4">ぺいほーむの住宅アドバイザーが、あなたの予算に合った工務店をご紹介します。</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/consultation"
              className="bg-white text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-gray-100 transition"
            >
              無料で相談する
            </Link>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#06C755] text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-[#05b04c] transition"
            >
              LINEで相談
            </a>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
          ※ このシミュレーションは概算です。実際の返済額は金融機関の審査結果によって異なります。<br />
          ※ 元利均等返済方式で計算しています。
        </p>
      </div>
    </>
  );
}
