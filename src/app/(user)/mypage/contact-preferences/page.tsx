'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { getOrCreateAnonymousId } from '@/lib/anonymous-id';
import {
  DEFAULT_CONTACT_PREFERENCES,
  CONTACT_FREQUENCY_LABELS,
  CONTACT_CHANNEL_LABELS,
  CONTACT_TIMESLOT_LABELS,
  CONTACT_PURPOSE_LABELS,
  CONSIDERATION_PHASE_LABELS,
  type ContactPreferences,
  type ContactFrequency,
  type ContactChannel,
  type ContactTimeSlot,
  type ContactPurpose,
  type ConsiderationPhase,
} from '@/lib/contact-preferences';

/**
 * 連絡の相性設定ページ（SMART MATCH）
 *
 * 会員様と工務店が最適なタイミング・手段でつながれるよう、
 * 会員様がご希望の連絡条件を設定する。工務店側は事前にこれを受け取り、
 * より質の高いご提案につなげる。
 */
export default function ContactPreferencesPage() {
  const { status } = useSession();
  const [prefs, setPrefs] = useState<ContactPreferences>(DEFAULT_CONTACT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    const anonymousId = getOrCreateAnonymousId();
    fetch(`/api/me/contact-preferences?anonymous_id=${anonymousId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.preferences) {
          setPrefs({
            frequency: res.preferences.frequency || DEFAULT_CONTACT_PREFERENCES.frequency,
            channels: res.preferences.channels || DEFAULT_CONTACT_PREFERENCES.channels,
            timeslots: res.preferences.timeslots || DEFAULT_CONTACT_PREFERENCES.timeslots,
            purpose: res.preferences.purpose || DEFAULT_CONTACT_PREFERENCES.purpose,
            consideration_phase:
              res.preferences.consideration_phase ||
              DEFAULT_CONTACT_PREFERENCES.consideration_phase,
            memo: res.preferences.memo || '',
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  const toggleChannel = (c: ContactChannel) => {
    setPrefs((p) => ({
      ...p,
      channels: p.channels.includes(c)
        ? p.channels.filter((x) => x !== c)
        : [...p.channels, c],
    }));
  };

  const toggleTimeslot = (t: ContactTimeSlot) => {
    setPrefs((p) => {
      // "anytime" を選んだら他を解除
      if (t === 'anytime') {
        return { ...p, timeslots: p.timeslots.includes('anytime') ? [] : ['anytime'] };
      }
      // 他を選んだら "anytime" を外す
      const filtered = p.timeslots.filter((x) => x !== 'anytime');
      return {
        ...p,
        timeslots: filtered.includes(t)
          ? filtered.filter((x) => x !== t)
          : [...filtered, t],
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const anonymousId = getOrCreateAnonymousId();
      const res = await fetch('/api/me/contact-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prefs, anonymous_id: anonymousId }),
      });
      if (!res.ok) throw new Error('save failed');
      setSaveMessage('設定を保存しました');
      setTimeout(() => setSaveMessage(null), 3500);
    } catch {
      setSaveMessage('保存に失敗しました。もう一度お試しください。');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <>
        <PageHeader
          title="連絡の相性設定"
          breadcrumbs={[
            { label: 'ホーム', href: '/' },
            { label: 'マイページ', href: '/mypage' },
            { label: '連絡の相性設定' },
          ]}
        />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h2 className="text-lg font-bold text-[#3D2200] mb-3">会員限定機能です</h2>
          <p className="text-sm text-gray-500 mb-6">
            会員登録すると、工務店との連絡方法・ペースを事前に設定して、
            お互いに心地よいコミュニケーションで家づくりを進められます。
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/signup?redirect=/mypage/contact-preferences"
              className="bg-[#E8740C] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#D4660A] transition"
            >
              無料会員登録する
            </Link>
            <Link
              href="/login?redirect=/mypage/contact-preferences"
              className="text-xs text-gray-500 hover:text-[#E8740C]"
            >
              すでに会員の方はログイン →
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="連絡の相性設定"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'マイページ', href: '/mypage' },
          { label: '連絡の相性設定' },
        ]}
        subtitle="お互いのペースで、ベストな家づくりを"
      />

      <section className="py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4">
          {/* 説明バナー */}
          <div className="bg-gradient-to-br from-[#FFF8F0] to-white border border-[#E8740C]/20 rounded-2xl p-6 mb-8">
            <p className="text-xs font-bold text-[#E8740C] tracking-widest mb-2">
              SMART MATCH｜お客様と工務店の相性設計
            </p>
            <h2 className="text-base md:text-lg font-bold text-[#3D2200] mb-2">
              お互いのペースで、ベストな家づくりを
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              ここで設定した内容は、見学会予約・問い合わせ時に工務店様と共有されます。
              工務店様は事前にあなたのご希望を把握することで、最適なタイミング・手段で
              より質の高いご提案をご用意いただけます。お互いの時間を大切にする、
              新しい家づくりコミュニケーションです。
            </p>
          </div>

          {/* ── 検討フェーズ ── */}
          <SectionBlock number={1} title="現在の検討フェーズ" description="あなたの現在地を工務店に伝えます">
            <div className="space-y-2">
              {(Object.keys(CONSIDERATION_PHASE_LABELS) as ConsiderationPhase[]).map((k) => {
                const info = CONSIDERATION_PHASE_LABELS[k];
                const selected = prefs.consideration_phase === k;
                return (
                  <button
                    key={k}
                    onClick={() => setPrefs({ ...prefs, consideration_phase: k })}
                    className={`w-full text-left p-4 rounded-xl border-2 transition ${
                      selected
                        ? 'border-[#E8740C] bg-[#FFF8F0]'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          selected ? 'border-[#E8740C] bg-[#E8740C]' : 'border-gray-300'
                        }`}
                      >
                        {selected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#3D2200]">{info.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{info.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionBlock>

          {/* ── 連絡頻度 ── */}
          <SectionBlock number={2} title="連絡の頻度" description="工務店からどれくらいの頻度で連絡してよいか">
            <div className="space-y-2">
              {(Object.keys(CONTACT_FREQUENCY_LABELS) as ContactFrequency[]).map((k) => {
                const label = CONTACT_FREQUENCY_LABELS[k];
                const selected = prefs.frequency === k;
                return (
                  <button
                    key={k}
                    onClick={() => setPrefs({ ...prefs, frequency: k })}
                    className={`w-full text-left p-4 rounded-xl border-2 transition ${
                      selected
                        ? 'border-[#E8740C] bg-[#FFF8F0]'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          selected ? 'border-[#E8740C] bg-[#E8740C]' : 'border-gray-300'
                        }`}
                      >
                        {selected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm font-bold text-[#3D2200]">{label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionBlock>

          {/* ── 連絡手段 ── */}
          <SectionBlock
            number={3}
            title="連絡手段（複数選択可）"
            description="どの手段での連絡を受け付けるか"
          >
            <div className="grid sm:grid-cols-3 gap-2">
              {(Object.keys(CONTACT_CHANNEL_LABELS) as ContactChannel[]).map((k) => {
                const label = CONTACT_CHANNEL_LABELS[k];
                const selected = prefs.channels.includes(k);
                return (
                  <button
                    key={k}
                    onClick={() => toggleChannel(k)}
                    className={`p-4 rounded-xl border-2 transition ${
                      selected
                        ? 'border-[#E8740C] bg-[#FFF8F0]'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <p className={`text-sm font-bold ${selected ? 'text-[#E8740C]' : 'text-gray-600'}`}>
                      {label}
                    </p>
                  </button>
                );
              })}
            </div>
            {prefs.channels.length === 0 && (
              <p className="text-xs text-red-500 mt-2">※ 少なくとも1つ選択してください</p>
            )}
          </SectionBlock>

          {/* ── 連絡時間帯 ── */}
          <SectionBlock
            number={4}
            title="連絡OKな時間帯（複数選択可）"
            description="「いつでもOK」を選ぶと他の項目は自動解除されます"
          >
            <div className="grid sm:grid-cols-2 gap-2">
              {(Object.keys(CONTACT_TIMESLOT_LABELS) as ContactTimeSlot[]).map((k) => {
                const label = CONTACT_TIMESLOT_LABELS[k];
                const selected = prefs.timeslots.includes(k);
                return (
                  <button
                    key={k}
                    onClick={() => toggleTimeslot(k)}
                    className={`p-4 rounded-xl border-2 transition text-left ${
                      selected
                        ? 'border-[#E8740C] bg-[#FFF8F0]'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <p className={`text-sm font-bold ${selected ? 'text-[#E8740C]' : 'text-gray-600'}`}>
                      {label}
                    </p>
                  </button>
                );
              })}
            </div>
          </SectionBlock>

          {/* ── 連絡目的 ── */}
          <SectionBlock
            number={5}
            title="連絡の目的"
            description="どの範囲までの連絡を受け入れるか"
          >
            <div className="space-y-2">
              {(Object.keys(CONTACT_PURPOSE_LABELS) as ContactPurpose[]).map((k) => {
                const label = CONTACT_PURPOSE_LABELS[k];
                const selected = prefs.purpose === k;
                return (
                  <button
                    key={k}
                    onClick={() => setPrefs({ ...prefs, purpose: k })}
                    className={`w-full text-left p-4 rounded-xl border-2 transition ${
                      selected
                        ? 'border-[#E8740C] bg-[#FFF8F0]'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          selected ? 'border-[#E8740C] bg-[#E8740C]' : 'border-gray-300'
                        }`}
                      >
                        {selected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm font-bold text-[#3D2200]">{label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionBlock>

          {/* ── メモ ── */}
          <SectionBlock
            number={6}
            title="工務店への追加メッセージ（任意）"
            description="伝えておきたいことを自由記述"
          >
            <textarea
              value={prefs.memo || ''}
              onChange={(e) => setPrefs({ ...prefs, memo: e.target.value })}
              placeholder="例：夫婦で検討しているため、返信に時間がかかる場合があります。"
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] resize-y"
              maxLength={300}
            />
            <p className="text-[10px] text-gray-400 text-right mt-1">
              {(prefs.memo || '').length} / 300
            </p>
          </SectionBlock>

          {/* ── 保存ボタン ── */}
          <div className="sticky bottom-4 bg-white border-2 border-[#E8740C]/20 rounded-2xl p-4 shadow-xl mt-8">
            {saveMessage && (
              <p
                className={`text-sm font-bold text-center mb-3 ${
                  saveMessage.includes('失敗') ? 'text-red-500' : 'text-green-600'
                }`}
              >
                {saveMessage}
              </p>
            )}
            <button
              onClick={handleSave}
              disabled={saving || prefs.channels.length === 0}
              className="w-full bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold py-3.5 rounded-full text-sm transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '保存中...' : '設定を保存する'}
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              設定内容は見学会予約・問い合わせ時に自動的に工務店へ共有されます
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/mypage"
              className="text-sm text-gray-500 hover:text-[#E8740C] font-bold"
            >
              ← マイページに戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionBlock({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 mb-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-[#E8740C] text-white rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0">
          {number}
        </div>
        <div>
          <h3 className="text-base md:text-lg font-bold text-[#3D2200]">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
