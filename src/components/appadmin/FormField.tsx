'use client';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
}

export default function FormField({ label, value, onChange, required, placeholder, multiline, rows, type = 'text' }: FormFieldProps) {
  const cls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]";
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} className={cls + " resize-y"} rows={rows || 3} placeholder={placeholder} />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} required={required} placeholder={placeholder} />
      }
    </div>
  );
}
