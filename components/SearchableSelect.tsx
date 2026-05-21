"use client";

import { useState, useRef, useEffect } from "react";
import { normalizeVi } from "@/lib/text";

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}

export default function SearchableSelect({ value, onChange, options, placeholder = "Chọn..." }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const q = normalizeVi(search);
  const filtered = options.filter((o) => normalizeVi(o).includes(q));

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <div
        className="min-h-[32px] border-b border-gray-300 focus-within:border-green-600 flex items-center flex-wrap gap-1 px-1 py-0.5 cursor-text"
        onClick={() => setOpen(true)}
      >
        {value ? (
          <span className="flex items-center gap-1 bg-gray-100 text-gray-800 text-sm px-2 py-0.5 rounded">
            {value}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="text-gray-400 hover:text-gray-700 leading-none"
            >×</button>
          </span>
        ) : (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-50 max-h-56 flex flex-col">
          <div className="flex items-center border-b border-gray-100 px-2">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="flex-1 text-sm py-1.5 outline-none"
            />
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <ul className="overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="text-sm text-gray-400 px-3 py-2">Không có kết quả</li>
            ) : filtered.map((opt) => (
              <li
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); setSearch(""); }}
                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${opt === value ? "bg-gray-100 font-medium" : ""}`}
              >
                {opt}
                {opt === value && (
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
