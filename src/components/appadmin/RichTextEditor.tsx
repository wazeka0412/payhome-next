'use client';

import { useRef, useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
}

const BTN = 'px-2 py-1 text-xs rounded hover:bg-gray-200 transition cursor-pointer select-none';

export default function RichTextEditor({ label, value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const initializedRef = useRef(false);

  // Keep onChange ref up to date without causing re-renders
  onChangeRef.current = onChange;

  // Set initial HTML only once on mount
  useEffect(() => {
    if (editorRef.current && !initializedRef.current) {
      editorRef.current.innerHTML = value;
      initializedRef.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) {
      onChangeRef.current(editorRef.current.innerHTML);
    }
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChangeRef.current(editorRef.current.innerHTML);
    }
  }, []);

  const insertLink = useCallback(() => {
    const url = prompt('URLを入力してください', 'https://');
    if (url) exec('createLink', url);
  }, [exec]);

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#E8740C]/30 focus-within:border-[#E8740C]">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50">
          <button type="button" className={`${BTN} font-bold`} onClick={() => exec('bold')} title="太字">B</button>
          <button type="button" className={`${BTN} italic`} onClick={() => exec('italic')} title="斜体">I</button>
          <button type="button" className={`${BTN} underline`} onClick={() => exec('underline')} title="下線">U</button>
          <span className="w-px bg-gray-200 mx-1" />
          <button type="button" className={BTN} onClick={() => exec('formatBlock', 'h2')} title="見出し2">H2</button>
          <button type="button" className={BTN} onClick={() => exec('formatBlock', 'h3')} title="見出し3">H3</button>
          <button type="button" className={BTN} onClick={() => exec('formatBlock', 'p')} title="段落">P</button>
          <span className="w-px bg-gray-200 mx-1" />
          <button type="button" className={BTN} onClick={() => exec('insertUnorderedList')} title="箇条書き">UL</button>
          <button type="button" className={BTN} onClick={() => exec('insertOrderedList')} title="番号付き">OL</button>
          <button type="button" className={BTN} onClick={() => exec('formatBlock', 'blockquote')} title="引用">引用</button>
          <span className="w-px bg-gray-200 mx-1" />
          <button type="button" className={BTN} onClick={insertLink} title="リンク">Link</button>
          <button type="button" className={BTN} onClick={() => exec('insertHorizontalRule')} title="区切り線">HR</button>
          <span className="w-px bg-gray-200 mx-1" />
          <button type="button" className={BTN} onClick={() => exec('undo')} title="元に戻す">↩</button>
          <button type="button" className={BTN} onClick={() => exec('redo')} title="やり直し">↪</button>
        </div>
        {/* Editor area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[240px] px-4 py-3 text-sm leading-relaxed focus:outline-none prose prose-sm max-w-none
            [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
            [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#E8740C]/30 [&_blockquote]:pl-4 [&_blockquote]:text-gray-600
            [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
            [&_a]:text-[#E8740C] [&_a]:underline"
          onInput={handleInput}
        />
      </div>
    </div>
  );
}
