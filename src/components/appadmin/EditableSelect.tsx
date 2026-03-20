'use client';

import { useState, useRef, useEffect } from 'react';

interface EditableSelectProps {
  label: string;
  value: string;
  options: string[];
  onChangeValue: (v: string) => void;
  onChangeOptions: (opts: string[]) => void;
  required?: boolean;
}

export default function EditableSelect({ label, value, options, onChangeValue, onChangeOptions, required }: EditableSelectProps) {
  const [editing, setEditing] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const addOption = () => {
    const trimmed = newOption.trim();
    if (!trimmed || options.includes(trimmed)) return;
    onChangeOptions([...options, trimmed]);
    setNewOption('');
  };

  const removeOption = (idx: number) => {
    const removed = options[idx];
    onChangeOptions(options.filter((_, i) => i !== idx));
    if (value === removed) onChangeValue('');
  };

  const startEdit = (idx: number) => {
    setEditIdx(idx);
    setEditValue(options[idx]);
  };

  const saveEdit = (idx: number) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    const old = options[idx];
    const updated = options.map((o, i) => i === idx ? trimmed : o);
    onChangeOptions(updated);
    if (value === old) onChangeValue(trimmed);
    setEditIdx(null);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="block text-xs font-medium text-gray-500">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className="text-[10px] text-[#E8740C] hover:underline cursor-pointer"
        >
          {editing ? '閉じる' : '選択肢を編集'}
        </button>
      </div>

      <select
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
        required={required}
      >
        <option value="">選択してください</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {editing && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }}
              placeholder="新しい選択肢を追加"
              className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#E8740C]/30"
            />
            <button
              type="button"
              onClick={addOption}
              className="bg-[#E8740C] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#d4680b] cursor-pointer"
            >
              追加
            </button>
          </div>
          <div className="space-y-1">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs">
                {editIdx === idx ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveEdit(idx); } }}
                      className="flex-1 border border-gray-300 rounded px-2 py-0.5 text-xs"
                      autoFocus
                    />
                    <button type="button" onClick={() => saveEdit(idx)} className="text-green-600 hover:text-green-800 cursor-pointer">&#10003;</button>
                    <button type="button" onClick={() => setEditIdx(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">&#10005;</button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-gray-700">{opt}</span>
                    <button type="button" onClick={() => startEdit(idx)} className="text-gray-400 hover:text-[#E8740C] cursor-pointer" title="編集">&#9998;</button>
                    <button type="button" onClick={() => removeOption(idx)} className="text-gray-400 hover:text-red-500 cursor-pointer" title="削除">&#10005;</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
