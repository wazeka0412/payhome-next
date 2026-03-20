'use client';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  /** Output format: 'iso' → 2026-03-15, 'dot' → 2026.03.15 */
  format?: 'iso' | 'dot';
}

function toIso(v: string): string {
  if (!v) return '';
  return v.replace(/\./g, '-');
}

function fromIso(iso: string, fmt: 'iso' | 'dot'): string {
  if (!iso) return '';
  return fmt === 'dot' ? iso.replace(/-/g, '.') : iso;
}

export default function DatePicker({ label, value, onChange, required, format = 'iso' }: DatePickerProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="date"
        value={toIso(value)}
        onChange={(e) => onChange(fromIso(e.target.value, format))}
        required={required}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
      />
    </div>
  );
}
