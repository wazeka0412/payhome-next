'use client';

import { useState } from 'react';
import ImageUploader from '@/components/appadmin/ImageUploader';
import FormField from '@/components/appadmin/FormField';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  photo: string[];
}

interface MediaAchievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface CompanyInfo {
  name: string;
  address: string;
  established: string;
  ceo: string;
  business: string;
  capital: string;
  employees: string;
}

const INITIAL_MEMBERS: TeamMember[] = [
  { id: 'm1', name: '田中 太郎', role: '代表', description: '住宅業界で15年の経験を持ち、家づくりの情報格差をなくすためにぺいほーむを創業。年間100棟以上の住宅取材を通じて、生の情報を届けています。', photo: [] },
  { id: 'm2', name: '鈴木 花子', role: 'ディレクター', description: '動画制作のディレクションを担当。視聴者目線でわかりやすいコンテンツ制作を心がけています。前職は住宅情報誌の編集者。', photo: [] },
  { id: 'm3', name: '佐藤 健一', role: 'エディター', description: '記事やSNSコンテンツの企画・編集を担当。SEOとユーザー体験の両立を追求し、月間50万PVのメディアに成長させました。', photo: [] },
  { id: 'm4', name: '山本 美咲', role: 'カメラマン', description: '住宅の魅力を最大限に引き出す撮影技術を持つ。建築写真の専門知識を活かし、工務店の施工事例を美しく記録しています。', photo: [] },
];

const INITIAL_MEDIA: MediaAchievement[] = [
  { id: 'ma1', title: 'SUUMOジャーナルに掲載', description: '住宅系YouTubeチャンネルの新しい形として、ぺいほーむの取り組みが紹介されました。', date: '2026-02-15' },
  { id: 'ma2', title: '日経クロストレンド取材', description: '住宅DXの最前線として、動画を活用した住宅情報メディアの事例として取材を受けました。', date: '2025-11-20' },
  { id: 'ma3', title: 'YouTube登録者10万人突破', description: '住宅専門チャンネルとしては異例のスピードで10万人を達成。視聴者コミュニティも活発に運営中。', date: '2025-08-01' },
];

const INITIAL_COMPANY: CompanyInfo = {
  name: '株式会社ぺいほーむ',
  address: '東京都渋谷区神宮前3-15-8 ぺいほーむビル5F',
  established: '2023年4月1日',
  ceo: '田中 太郎',
  business: '住宅情報メディアの運営、動画コンテンツ制作、住宅コンサルティング、工務店向けマーケティング支援',
  capital: '1,000万円',
  employees: '12名（業務委託含む）',
};

type MemberEditMode = 'list' | 'add' | 'edit';
type MediaEditMode = 'list' | 'add' | 'edit';

export default function AboutAdmin() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [memberMode, setMemberMode] = useState<MemberEditMode>('list');
  const [editMember, setEditMember] = useState<TeamMember | null>(null);

  const [mediaItems, setMediaItems] = useState<MediaAchievement[]>(INITIAL_MEDIA);
  const [mediaMode, setMediaMode] = useState<MediaEditMode>('list');
  const [editMedia, setEditMedia] = useState<MediaAchievement | null>(null);

  const [company, setCompany] = useState<CompanyInfo>(INITIAL_COMPANY);
  const [saved, setSaved] = useState(false);

  // Member form state
  const [mName, setMName] = useState('');
  const [mRole, setMRole] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mPhoto, setMPhoto] = useState<string[]>([]);

  // Media form state
  const [maTitle, setMaTitle] = useState('');
  const [maDesc, setMaDesc] = useState('');
  const [maDate, setMaDate] = useState('');

  const openAddMember = () => {
    setMName(''); setMRole(''); setMDesc(''); setMPhoto([]);
    setEditMember(null);
    setMemberMode('add');
  };

  const openEditMember = (m: TeamMember) => {
    setMName(m.name); setMRole(m.role); setMDesc(m.description); setMPhoto(m.photo);
    setEditMember(m);
    setMemberMode('edit');
  };

  const saveMember = () => {
    if (!mName.trim() || !mRole.trim()) return;
    const data: TeamMember = {
      id: editMember?.id || `m-${Date.now()}`,
      name: mName, role: mRole, description: mDesc, photo: mPhoto,
    };
    if (memberMode === 'edit' && editMember) {
      setMembers((prev) => prev.map((m) => (m.id === editMember.id ? data : m)));
    } else {
      setMembers((prev) => [...prev, data]);
    }
    setMemberMode('list');
  };

  const deleteMember = (id: string) => {
    if (!confirm('このメンバーを削除しますか？')) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const openAddMedia = () => {
    setMaTitle(''); setMaDesc(''); setMaDate('');
    setEditMedia(null);
    setMediaMode('add');
  };

  const openEditMedia = (m: MediaAchievement) => {
    setMaTitle(m.title); setMaDesc(m.description); setMaDate(m.date);
    setEditMedia(m);
    setMediaMode('edit');
  };

  const saveMedia = () => {
    if (!maTitle.trim()) return;
    const data: MediaAchievement = {
      id: editMedia?.id || `ma-${Date.now()}`,
      title: maTitle, description: maDesc, date: maDate,
    };
    if (mediaMode === 'edit' && editMedia) {
      setMediaItems((prev) => prev.map((m) => (m.id === editMedia.id ? data : m)));
    } else {
      setMediaItems((prev) => [...prev, data]);
    }
    setMediaMode('list');
  };

  const deleteMedia = (id: string) => {
    if (!confirm('この実績を削除しますか？')) return;
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
  };

  const updateCompany = (field: keyof CompanyInfo, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About管理</h1>
          <p className="text-sm text-gray-500 mt-1">Aboutページの各セクションを管理します</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#E8740C] text-white rounded-lg text-sm font-semibold hover:bg-[#d06a0b] transition cursor-pointer"
        >
          {saved ? '保存しました' : '変更を保存'}
        </button>
      </div>

      {/* チームメンバー管理 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">チームメンバー管理</h2>
          {memberMode === 'list' && (
            <button onClick={openAddMember} className="px-4 py-1.5 bg-[#E8740C] text-white rounded-lg text-xs font-semibold hover:bg-[#d06a0b] transition cursor-pointer">
              + メンバー追加
            </button>
          )}
        </div>

        {memberMode !== 'list' ? (
          <div className="border border-gray-100 rounded-lg p-5 bg-gray-50 space-y-4">
            <h3 className="text-sm font-bold text-gray-700">
              {memberMode === 'add' ? 'メンバー追加' : 'メンバー編集'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="名前" value={mName} onChange={setMName} required placeholder="山田 太郎" />
              <FormField label="役職" value={mRole} onChange={setMRole} required placeholder="代表" />
            </div>
            <FormField label="紹介文" value={mDesc} onChange={setMDesc} multiline rows={3} placeholder="メンバーの紹介文を入力..." />
            <ImageUploader label="プロフィール写真" images={mPhoto} onChange={setMPhoto} multiple={false} />
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
              <button onClick={() => setMemberMode('list')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                キャンセル
              </button>
              <button onClick={saveMember} className="px-5 py-2 bg-[#E8740C] text-white rounded-lg text-sm font-semibold hover:bg-[#d06a0b] transition cursor-pointer">
                {memberMode === 'add' ? '追加する' : '更新する'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-4 border border-gray-100 rounded-lg p-4 hover:bg-gray-50/50 transition">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {m.photo.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo[0]} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-lg">👤</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{m.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8740C]/10 text-[#E8740C] font-medium">{m.role}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{m.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEditMember(m)} className="text-xs text-[#E8740C] hover:text-[#d06a0b] font-medium cursor-pointer">
                    編集
                  </button>
                  <button onClick={() => deleteMember(m.id)} className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer">
                    削除
                  </button>
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">メンバーが登録されていません</p>
            )}
          </div>
        )}
      </div>

      {/* メディア実績管理 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">メディア実績管理</h2>
          {mediaMode === 'list' && (
            <button onClick={openAddMedia} className="px-4 py-1.5 bg-[#E8740C] text-white rounded-lg text-xs font-semibold hover:bg-[#d06a0b] transition cursor-pointer">
              + 実績追加
            </button>
          )}
        </div>

        {mediaMode !== 'list' ? (
          <div className="border border-gray-100 rounded-lg p-5 bg-gray-50 space-y-4">
            <h3 className="text-sm font-bold text-gray-700">
              {mediaMode === 'add' ? '実績追加' : '実績編集'}
            </h3>
            <FormField label="タイトル" value={maTitle} onChange={setMaTitle} required placeholder="掲載メディア名など" />
            <FormField label="説明" value={maDesc} onChange={setMaDesc} multiline rows={3} placeholder="掲載内容の説明..." />
            <FormField label="日付" value={maDate} onChange={setMaDate} type="date" />
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
              <button onClick={() => setMediaMode('list')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                キャンセル
              </button>
              <button onClick={saveMedia} className="px-5 py-2 bg-[#E8740C] text-white rounded-lg text-sm font-semibold hover:bg-[#d06a0b] transition cursor-pointer">
                {mediaMode === 'add' ? '追加する' : '更新する'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {mediaItems.map((m) => (
              <div key={m.id} className="flex items-center gap-4 border border-gray-100 rounded-lg p-4 hover:bg-gray-50/50 transition">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{m.title}</span>
                    <span className="text-xs text-gray-400">{m.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{m.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEditMedia(m)} className="text-xs text-[#E8740C] hover:text-[#d06a0b] font-medium cursor-pointer">
                    編集
                  </button>
                  <button onClick={() => deleteMedia(m.id)} className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer">
                    削除
                  </button>
                </div>
              </div>
            ))}
            {mediaItems.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">実績が登録されていません</p>
            )}
          </div>
        )}
      </div>

      {/* 会社概要 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">会社概要</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="会社名" value={company.name} onChange={(v) => updateCompany('name', v)} />
          <FormField label="代表者" value={company.ceo} onChange={(v) => updateCompany('ceo', v)} />
          <FormField label="設立日" value={company.established} onChange={(v) => updateCompany('established', v)} />
          <FormField label="資本金" value={company.capital} onChange={(v) => updateCompany('capital', v)} />
          <FormField label="従業員数" value={company.employees} onChange={(v) => updateCompany('employees', v)} />
          <FormField label="所在地" value={company.address} onChange={(v) => updateCompany('address', v)} />
        </div>
        <div className="mt-4">
          <FormField label="事業内容" value={company.business} onChange={(v) => updateCompany('business', v)} multiline rows={3} />
        </div>
      </div>
    </div>
  );
}
