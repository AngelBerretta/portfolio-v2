'use client';

import { useState, useRef, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

export function TagSelector({
  name,
  allTags,
  initialTags = [],
}: {
  name: string;
  allTags: string[];
  initialTags?: string[];
}) {
  const [selected, setSelected] = useState<string[]>(initialTags);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = allTags.filter(
    (tag) =>
      tag.toLowerCase().includes(input.toLowerCase()) &&
      !selected.includes(tag) &&
      input.length > 0
  );

  function addTag(tag: string) {
    const clean = tag.trim();
    if (!clean || selected.includes(clean)) return;
    setSelected((prev) => [...prev, clean]);
    setInput('');
    inputRef.current?.focus();
  }

  function removeTag(tag: string) {
    setSelected((prev) => prev.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && input === '' && selected.length > 0) {
      removeTag(selected[selected.length - 1]);
    }
  }

  return (
    <div>
      {/* Hidden inputs: esto es lo que FormData.getAll('tags') va a leer */}
      {selected.map((tag) => (
        <input key={tag} type="hidden" name={name} value={tag} />
      ))}

      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
        {selected.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/15 text-blue-300 text-sm rounded-md"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-white transition"
              aria-label={`Quitar ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? 'Escribí y presioná Enter (ej: React)' : ''}
          className="flex-1 min-w-[120px] bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none py-0.5"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <span className="text-xs text-gray-500 self-center mr-1">Sugerencias:</span>
          {suggestions.slice(0, 6).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="px-2 py-0.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
