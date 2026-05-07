"use client";

import { useState } from "react";
import { NguonGen } from "@/data/nguonGen";
import { ExtendedFormData, Form1Data, Form2Data, Form3Data, Form4Data, defaultForm1, defaultForm2, defaultForm3, defaultForm4 } from "@/data/extendedTypes";
import Form1BasicInfo from "./edit-forms/Form1BasicInfo";
import Form2Survey from "./edit-forms/Form2Survey";
import Form3InitialAssessment from "./edit-forms/Form3InitialAssessment";
import Form4DetailedAssessment from "./edit-forms/Form4DetailedAssessment";

interface EditModalProps {
  item: NguonGen;
  extended: ExtendedFormData;
  onSave: (updated: NguonGen, ext: ExtendedFormData) => void;
  onClose: () => void;
}

const TABS = [
  { label: 'Thông tin cơ bản', short: 'Cơ bản' },
  { label: 'Dữ liệu điều tra, thu thập', short: 'Điều tra' },
  { label: 'Dữ liệu đánh giá ban đầu', short: 'Đánh giá ban đầu' },
  { label: 'Dữ liệu đánh giá chi tiết', short: 'Đánh giá chi tiết' },
];

export default function EditModal({ item, extended, onSave, onClose }: EditModalProps) {
  const [tab, setTab] = useState(0);
  const [basic, setBasic] = useState<NguonGen>({ ...item });
  const [form1, setForm1] = useState<Partial<Form1Data>>(extended.form1 ?? defaultForm1());
  const [form2, setForm2] = useState<Partial<Form2Data>>(extended.form2 ?? defaultForm2());
  const [form3, setForm3] = useState<Partial<Form3Data>>(extended.form3 ?? defaultForm3());
  const [form4, setForm4] = useState<Partial<Form4Data>>(extended.form4 ?? defaultForm4());

  const handleSave = () => onSave(basic, { form1, form2, form3, form4 });

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-white">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="min-w-0">
          <h2 className="font-bold text-base">Chỉnh sửa nguồn gen</h2>
          <p className="text-green-100 text-xs font-mono mt-0.5 truncate">{item.ma} — {item.ten}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleSave} className="bg-white text-green-700 font-semibold text-sm px-4 py-1.5 rounded hover:bg-green-50 transition-colors">
            Lưu tất cả
          </button>
          <button onClick={onClose} className="text-green-100 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 shrink-0 overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`px-3 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === i ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="sm:hidden">{t.short}</span>
            <span className="hidden sm:inline"><span className="mr-1 text-xs text-gray-400">{i + 1}.</span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
        {tab === 0 && <Form1BasicInfo basic={basic} data={form1} onBasicChange={setBasic} onDataChange={setForm1} />}
        {tab === 1 && <Form2Survey data={form2} onChange={setForm2} />}
        {tab === 2 && <Form3InitialAssessment ma={item.ma} data={form3} onChange={setForm3} />}
        {tab === 3 && <Form4DetailedAssessment ma={item.ma} data={form4} onChange={setForm4} />}
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex gap-1.5">
          {TABS.map((_, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === tab ? 'bg-green-600' : 'bg-gray-300'}`} />
          ))}
        </div>
        <div className="flex gap-2">
          {tab > 0 && (
            <button onClick={() => setTab(tab - 1)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              ← Trước
            </button>
          )}
          {tab < 3 ? (
            <button onClick={() => setTab(tab + 1)}
              className="px-3 py-1.5 text-sm bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors">
              Tiếp theo →
            </button>
          ) : (
            <button onClick={handleSave}
              className="px-4 py-1.5 text-sm bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
              Lưu tất cả
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
