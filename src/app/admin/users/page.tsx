'use client';

import { useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'builder' | 'user';
  status: 'active' | 'suspended' | 'invited';
  lastLogin: string;
};

const roleLabels: Record<string, { label: string; color: string }> = {
  admin: { label: '管理者', color: 'bg-red-100 text-red-700' },
  builder: { label: '工務店', color: 'bg-orange-100 text-orange-700' },
  user: { label: 'ユーザー', color: 'bg-blue-100 text-blue-700' },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'アクティブ', color: 'bg-green-100 text-green-700' },
  suspended: { label: '停止', color: 'bg-red-100 text-red-700' },
  invited: { label: '招待中', color: 'bg-yellow-100 text-yellow-700' },
};

const initialUsers: User[] = [
  { id: '1', name: '田中太郎', email: 'tanaka@payhome.jp', role: 'admin', status: 'active', lastLogin: '2026-03-21 09:15' },
  { id: '2', name: '佐藤花子', email: 'sato@payhome.jp', role: 'admin', status: 'active', lastLogin: '2026-03-21 08:30' },
  { id: '3', name: '鈴木建設', email: 'suzuki@builder.co.jp', role: 'builder', status: 'active', lastLogin: '2026-03-20 17:45' },
  { id: '4', name: '山田工務店', email: 'yamada@koumuten.jp', role: 'builder', status: 'active', lastLogin: '2026-03-20 14:20' },
  { id: '5', name: '高橋ハウス', email: 'takahashi@house.jp', role: 'builder', status: 'suspended', lastLogin: '2026-03-10 11:00' },
  { id: '6', name: '伊藤住宅', email: 'ito@jutaku.co.jp', role: 'builder', status: 'invited', lastLogin: '-' },
  { id: '7', name: '渡辺一郎', email: 'watanabe@gmail.com', role: 'user', status: 'active', lastLogin: '2026-03-21 07:00' },
  { id: '8', name: '中村美咲', email: 'nakamura@yahoo.co.jp', role: 'user', status: 'active', lastLogin: '2026-03-19 22:10' },
  { id: '9', name: '小林健太', email: 'kobayashi@outlook.jp', role: 'user', status: 'active', lastLogin: '2026-03-18 16:30' },
  { id: '10', name: '加藤誠', email: 'kato@icloud.com', role: 'user', status: 'suspended', lastLogin: '2026-02-28 09:00' },
  { id: '11', name: '吉田恵', email: 'yoshida@gmail.com', role: 'user', status: 'invited', lastLogin: '-' },
  { id: '12', name: '松本建築', email: 'matsumoto@kenchiku.jp', role: 'builder', status: 'active', lastLogin: '2026-03-21 10:05' },
];

const permissions = ['リード閲覧', 'リード編集', '物件管理', '工務店管理', '設定変更', 'ユーザー管理'];
const initialMatrix: Record<string, boolean[]> = {
  admin: [true, true, true, true, true, true],
  builder: [true, false, true, false, false, false],
  user: [true, false, false, false, false, false],
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [matrix, setMatrix] = useState(initialMatrix);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' as User['role'], sendInvite: true });

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    builders: users.filter(u => u.role === 'builder').length,
    active: users.filter(u => u.status === 'active').length,
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(u => u.id)));
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const u: User = { id: String(Date.now()), name: newUser.name, email: newUser.email, role: newUser.role, status: 'invited', lastLogin: '-' };
    setUsers([u, ...users]);
    setNewUser({ name: '', email: '', role: 'user', sendInvite: true });
    setShowAddForm(false);
  };

  const handleBulkSuspend = () => {
    setUsers(users.map(u => selected.has(u.id) ? { ...u, status: 'suspended' as const } : u));
    setSelected(new Set());
  };

  const handleBulkDelete = () => {
    setUsers(users.filter(u => !selected.has(u.id)));
    setSelected(new Set());
  };

  const handleSaveEdit = () => {
    if (!editUser) return;
    setUsers(users.map(u => u.id === editUser.id ? editUser : u));
    setEditUser(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ユーザー・権限管理</h1>
          <p className="text-sm text-gray-500 mt-1">ユーザーアカウントとロール権限の管理</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2 bg-[#E8740C] text-white rounded-lg text-sm font-medium hover:bg-[#d06a0b] transition">+ ユーザー追加</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '総ユーザー数', value: stats.total },
          { label: '管理者', value: stats.admins },
          { label: '工務店', value: stats.builders },
          { label: 'アクティブセッション', value: stats.active },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">新規ユーザー追加</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-600 mb-1">名前</label>
              <input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="名前" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">メールアドレス</label>
              <input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">ロール</label>
              <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value as User['role'] })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="user">ユーザー</option>
                <option value="builder">工務店</option>
                <option value="admin">管理者</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={newUser.sendInvite} onChange={e => setNewUser({ ...newUser, sendInvite: e.target.checked })} className="accent-[#E8740C]" />
                招待メール送信
              </label>
              <button onClick={handleAddUser} className="px-4 py-2 bg-[#E8740C] text-white rounded-lg text-sm font-medium hover:bg-[#d06a0b]">追加</button>
            </div>
          </div>
        </div>
      )}

      {/* Search + Bulk Actions */}
      <div className="flex items-center gap-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="名前・メールで検索..." className="flex-1 max-w-sm border border-gray-200 rounded-lg px-4 py-2 text-sm" />
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{selected.size}件選択中</span>
            <button onClick={handleBulkSuspend} className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200">一括停止</button>
            <button onClick={handleBulkDelete} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">一括削除</button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 text-left"><input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-[#E8740C]" /></th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">名前</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">メール</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">ロール</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">ステータス</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">最終ログイン</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-orange-50/50 transition">
                  <td className="py-3 px-4"><input type="checkbox" checked={selected.has(user.id)} onChange={() => toggleSelect(user.id)} className="accent-[#E8740C]" /></td>
                  <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4"><span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${roleLabels[user.role].color}`}>{roleLabels[user.role].label}</span></td>
                  <td className="py-3 px-4"><span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusLabels[user.status].color}`}>{statusLabels[user.status].label}</span></td>
                  <td className="py-3 px-4 text-gray-500">{user.lastLogin}</td>
                  <td className="py-3 px-4"><button onClick={() => setEditUser({ ...user })} className="text-[#E8740C] text-sm font-medium hover:underline">編集</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditUser(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">ユーザー編集: {editUser.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">ロール</label>
                <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value as User['role'] })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option value="user">ユーザー</option>
                  <option value="builder">工務店</option>
                  <option value="admin">管理者</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">ステータス</label>
                <select value={editUser.status} onChange={e => setEditUser({ ...editUser, status: e.target.value as User['status'] })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option value="active">アクティブ</option>
                  <option value="suspended">停止</option>
                  <option value="invited">招待中</option>
                </select>
              </div>
              <button className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">パスワードリセット</button>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditUser(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">キャンセル</button>
                <button onClick={handleSaveEdit} className="flex-1 px-4 py-2 bg-[#E8740C] text-white rounded-lg text-sm font-medium hover:bg-[#d06a0b]">保存</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permission Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">ロール権限マトリクス</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-4 text-left text-gray-500 font-medium">ロール</th>
                {permissions.map(p => <th key={p} className="py-3 px-4 text-center text-gray-500 font-medium">{p}</th>)}
              </tr>
            </thead>
            <tbody>
              {(['admin', 'builder', 'user'] as const).map(role => (
                <tr key={role} className="border-b border-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{roleLabels[role].label}</td>
                  {matrix[role].map((checked, i) => (
                    <td key={i} className="py-3 px-4 text-center">
                      <input type="checkbox" checked={checked} onChange={() => {
                        const next = { ...matrix, [role]: [...matrix[role]] };
                        next[role][i] = !next[role][i];
                        setMatrix(next);
                      }} className="accent-[#E8740C] w-4 h-4" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-[#E8740C] text-white rounded-lg text-sm font-medium hover:bg-[#d06a0b]">権限を保存</button>
        </div>
      </div>
    </div>
  );
}
